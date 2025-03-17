
import { useState, useCallback } from 'react';
import { useSupabaseQuery } from './api/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patient';
import { formatErrorMessage } from '@/utils/errorHandling';

export interface PatientDataState<T = Patient> {
  patient: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and manage patient data with proper caching
 */
export function usePatientData(patientId?: string) {
  const [error, setError] = useState<string | null>(null);

  // Use react-query for data fetching with caching
  const { 
    data: patient, 
    isLoading,
    refetch
  } = useSupabaseQuery<Patient | null>(
    ['patient', patientId || ''], 
    async () => {
      if (!patientId) return null;
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .maybeSingle();
        
      if (error) throw error;
      return data as Patient;
    },
    {
      enabled: !!patientId
    }
  );

  // Function to manually fetch patient data
  const fetchPatient = useCallback(async () => {
    try {
      await refetch();
      setError(null);
    } catch (err) {
      setError(formatErrorMessage(err));
    }
  }, [refetch]);

  return {
    patient,
    isLoading,
    error,
    fetchPatient
  };
}
