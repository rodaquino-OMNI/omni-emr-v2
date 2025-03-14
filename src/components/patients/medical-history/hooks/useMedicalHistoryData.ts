
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logPatientAccess } from '../utils/auditUtils';

// Define a type for the history entries
export interface HistoryEntry {
  id: string;
  patientId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
  title: string;
  type: string;
  details: any;
}

// Mock data for development purposes
const mockHistoryEntries: HistoryEntry[] = [
  {
    id: 'hist-1',
    patientId: 'patient-1',
    createdAt: new Date('2023-05-10T14:30:00'),
    updatedAt: new Date('2023-05-10T14:30:00'),
    createdBy: {
      id: 'user-1',
      name: 'Dr. Emily Chen'
    },
    title: 'Initial Assessment',
    type: 'assessment',
    details: {
      changes: ['Initial documentation of patient history'],
      symptoms: ['Fatigue', 'Headache', 'Nausea']
    }
  },
  {
    id: 'hist-2',
    patientId: 'patient-1',
    createdAt: new Date('2023-06-15T10:15:00'),
    updatedAt: new Date('2023-06-15T10:15:00'),
    createdBy: {
      id: 'user-2',
      name: 'Dr. James Wilson'
    },
    title: 'Updated Medical History',
    type: 'update',
    details: {
      changes: ['Added family history of diabetes', 'Updated current medications'],
      notes: 'Patient reported new symptoms'
    }
  },
  {
    id: 'hist-3',
    patientId: 'patient-2',
    createdAt: new Date('2023-07-20T16:45:00'),
    updatedAt: new Date('2023-07-20T16:45:00'),
    createdBy: {
      id: 'user-1',
      name: 'Dr. Emily Chen'
    },
    title: 'Allergy Update',
    type: 'allergy',
    details: {
      changes: ['Added new allergy to penicillin'],
      severity: 'Moderate',
      reaction: 'Skin rash'
    }
  }
];

/**
 * Fetches medical history entries for a specific patient
 */
export const useMedicalHistoryData = (patientId: string) => {
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!patientId) {
        setHistoryEntries([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // In a real app, this would be fetched from an API or database
        // For now, we'll just filter our mock data
        const filteredEntries = mockHistoryEntries.filter(
          entry => entry.patientId === patientId
        );
        
        // Sort by date (most recent first)
        const sortedEntries = [...filteredEntries].sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        
        setHistoryEntries(sortedEntries);
      } catch (err) {
        console.error('Error fetching medical history:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalHistory();
  }, [patientId]);

  return {
    historyEntries,
    loading,
    error
  };
};
