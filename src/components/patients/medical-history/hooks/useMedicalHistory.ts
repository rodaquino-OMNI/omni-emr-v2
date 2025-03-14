
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logPatientAccess } from '../utils/auditUtils';

export type HistoryEntry = {
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

export const useMedicalHistory = (patientId: string, userId?: string) => {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHistoryEntries = async () => {
      setLoading(true);
      
      try {
        // Log access to this patient's data for HIPAA compliance
        if (userId) {
          await logPatientAccess(userId, patientId);
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
  }, [patientId, userId]);

  return { historyEntries, loading };
};
