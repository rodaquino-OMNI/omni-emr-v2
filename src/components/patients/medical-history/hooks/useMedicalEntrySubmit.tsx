
import { supabase } from '@/integrations/supabase/core';
import { toast } from '@/hooks/use-toast';

interface UseMedicalEntrySubmitProps {
  patientId: string;
  onEntryAdded: () => void;
  onClose: () => void;
  setError: (error: string | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

interface EntrySubmitData {
  title: string;
  notes: string;
  recorderId: string;
  recorderName: string;
}

export const useMedicalEntrySubmit = ({
  patientId,
  onEntryAdded,
  onClose,
  setError,
  setIsSubmitting
}: UseMedicalEntrySubmitProps) => {
  
  /**
   * Create an audit log for the entry
   */
  const createAuditLog = async (resourceId: string, data: EntrySubmitData) => {
    try {
      const clientInfo = {
        ip: 'client_ip_unknown',
        userAgent: navigator.userAgent || 'unknown'
      };
      
      await supabase
        .from('audit_logs')
        .insert({
          user_id: data.recorderId,
          action: 'create',
          resource_type: 'ClinicalImpression',
          resource_id: resourceId,
          details: JSON.stringify({
            title: data.title,
            recorder: data.recorderName,
            subject_id: patientId
          }),
          ip_address: clientInfo.ip,
          user_agent: clientInfo.userAgent
        });
    } catch (err) {
      console.error('Failed to create audit log:', err);
      // Don't block the main flow if audit logging fails
    }
  };
  
  /**
   * Submit the entry to the database
   */
  const submitEntry = async (data: EntrySubmitData) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Map data to match the Supabase table structure
      const entryData = {
        patient_id: patientId,
        provider_id: data.recorderId,
        provider_name: data.recorderName,
        title: data.title,
        notes: data.notes,
        entry_date: new Date().toISOString()
      };
      
      // Save to Supabase
      const { data: responseData, error: insertError } = await supabase
        .from('medical_history_entries')
        .insert(entryData)
        .select();
        
      if (insertError) {
        throw insertError;
      }
      
      // Create audit log
      if (responseData && responseData[0]) {
        await createAuditLog(responseData[0].id, data);
      }
      
      // Show success message
      toast({
        title: 'Medical history entry added successfully',
        variant: "success"
      });
      
      // Notify parent component and close form
      onEntryAdded();
      onClose();
      
      return true;
    } catch (err) {
      console.error('Error saving entry:', err);
      setError('Failed to save entry. Please try again.');
      toast({
        title: 'Failed to save medical history entry',
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return { submitEntry };
};
