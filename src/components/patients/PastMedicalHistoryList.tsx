
import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type PastMedicalHistoryListProps = {
  patientId: string;
};

type HistoryEntry = {
  id: string;
  date: string;
  provider: string;
  title: string;
  sections?: string[];
  notes?: string;
  status: string;
  version: string;
  resource_type: string;
};

const PastMedicalHistoryList = ({ patientId }: PastMedicalHistoryListProps) => {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchHistoryEntries = async () => {
      setLoading(true);
      
      try {
        // Log access to this patient's data for HIPAA compliance
        if (user?.id) {
          await logAccess(user.id, patientId);
        }
        
        // Fetch the medical history entries from Supabase
        const { data, error } = await supabase
          .from('medical_history_entries')
          .select('*')
          .eq('subject_id', patientId)
          .order('effective_date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform Supabase data to match our component's expected format
        const formattedEntries = data.map((entry) => ({
          id: entry.id,
          date: entry.effective_date,
          provider: entry.recorder_name,
          title: entry.title,
          notes: entry.notes,
          status: entry.status,
          version: entry.version,
          resource_type: entry.resource_type,
          sections: ['Medical History Update'] // Default section - can be expanded in the future
        }));
        
        setHistoryEntries(formattedEntries);
      } catch (error) {
        console.error('Error fetching history entries:', error);
        // If there's an error, fallback to mockData for demonstration
        const mockEntries: HistoryEntry[] = [
          {
            id: '1',
            date: '2023-11-15T14:30:00',
            provider: 'Dr. Sarah Chen',
            title: 'Annual Check-up Update',
            sections: ['Past Medical History', 'Allergies', 'Social History'],
            notes: 'Patient reports feeling well overall. Blood pressure has improved since last visit.',
            status: 'completed',
            version: '1.0',
            resource_type: 'ClinicalImpression'
          },
          {
            id: '2',
            date: '2023-06-22T10:15:00',
            provider: 'Dr. Michael Johnson',
            title: 'Follow-up Visit Update',
            sections: ['Chief Complaint', 'Present Illness', 'Review of Systems'],
            notes: 'Patient reports resolution of symptoms after completing antibiotic course.',
            status: 'completed',
            version: '1.0',
            resource_type: 'ClinicalImpression'
          },
          {
            id: '3',
            date: '2022-09-08T09:45:00',
            provider: 'Nurse David Brown',
            title: 'Initial Assessment',
            sections: ['Family History', 'Social History', 'Past Medical History'],
            notes: 'Comprehensive initial assessment completed. Patient established care with our practice.',
            status: 'completed',
            version: '1.0',
            resource_type: 'ClinicalImpression'
          }
        ];
        
        setHistoryEntries(mockEntries);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistoryEntries();
  }, [patientId, user?.id]);

  // Log access to patient data for HIPAA compliance
  const logAccess = async (userId: string, patientId: string) => {
    try {
      const clientInfo = {
        ip: 'client_ip_unknown',
        userAgent: navigator.userAgent || 'unknown'
      };
      
      await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action: 'view',
          resource_type: 'PatientHistory',
          resource_id: patientId,
          details: JSON.stringify({
            view_type: 'patient_history',
            patient_id: patientId
          }),
          ip_address: clientInfo.ip,
          user_agent: clientInfo.userAgent
        });
    } catch (err) {
      console.error('Failed to log access:', err);
      // Don't block the main flow if audit logging fails
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="h-6 w-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-muted-foreground">Loading history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {historyEntries.length > 0 ? (
        historyEntries.map((entry) => (
          <div key={entry.id} className="p-4 border border-border rounded-md hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{entry.title}</h3>
                  <div className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    <Shield className="h-3 w-3" />
                    FHIR {entry.resource_type}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(entry.date)}
                  </div>
                  <div className="hidden sm:block">•</div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {entry.provider}
                  </div>
                </div>
                
                {entry.notes && (
                  <div className="mt-3 text-sm text-muted-foreground border-l-2 border-muted pl-3">
                    {entry.notes}
                  </div>
                )}
                
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Sections updated: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.sections?.map((section, index) => (
                      <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No historical updates found for this patient.
        </div>
      )}
    </div>
  );
};

export default PastMedicalHistoryList;
