
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseNewEntryFormProps {
  patientId: string;
  onEntryAdded: () => void;
  onClose: () => void;
}

export const useNewEntryForm = ({ patientId, onEntryAdded, onClose }: UseNewEntryFormProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const recorderName = user?.name || 'Unknown Provider';
  const recorderId = user?.id || 'unknown';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const createAuditLog = async (resourceId: string) => {
    try {
      const clientInfo = {
        ip: 'client_ip_unknown',
        userAgent: navigator.userAgent || 'unknown'
      };
      
      await supabase
        .from('audit_logs')
        .insert({
          user_id: recorderId,
          action: 'create',
          resource_type: 'ClinicalImpression',
          resource_id: resourceId,
          details: JSON.stringify({
            title,
            recorder: recorderName,
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // FHIR-compliant data structure
      const effectiveDate = new Date().toISOString();
      const entryData = {
        subject_id: patientId,
        recorder_id: recorderId,
        recorder_name: recorderName,
        title,
        notes,
        effective_date: effectiveDate,
        resource_type: 'ClinicalImpression',
        status: 'completed',
        subject_reference: `Patient/${patientId}`,
        date_recorded: effectiveDate,
        version: '1.0',
        meta: JSON.stringify({
          versionId: '1',
          lastUpdated: effectiveDate,
          source: 'MedCare EHR'
        }),
        security_tags: JSON.stringify({
          hipaa_compliance: true,
          access_level: 'restricted',
          sensitivity: 'normal'
        }),
        last_updated_by: recorderId
      };
      
      // Save to Supabase
      const { data, error: insertError } = await supabase
        .from('medical_history_entries')
        .insert(entryData)
        .select();
        
      if (insertError) {
        throw insertError;
      }
      
      // Create audit log
      if (data && data[0]) {
        await createAuditLog(data[0].id);
      }
      
      // Reset form
      setTitle('');
      setNotes('');
      onClose();
      
      // Notify parent component
      onEntryAdded();
      
      // Show success message
      toast.success('Medical history entry added successfully');
    } catch (err) {
      console.error('Error saving entry:', err);
      setError('Failed to save entry. Please try again.');
      toast.error('Failed to save medical history entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    notes,
    setNotes,
    isSubmitting,
    error,
    recorderName,
    currentDate,
    handleSubmit
  };
};
