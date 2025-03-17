
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
      
      // Ensure phone is always defined to match PatientTypes.Patient interface
      if (data) {
        return {
          ...data,
          phone: data.phone || data.phone_number || null
        } as Patient;
      }
      
      return null;
    },
    {
      enabled: !!patientId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
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

  // Function to update patient data
  const updatePatient = useCallback(async (updatedData: Partial<Patient>) => {
    if (!patientId) {
      throw new Error('Patient ID is required for updates');
    }

    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updatedData)
        .eq('id', patientId)
        .select('*')
        .single();

      if (error) throw error;
      
      // Refresh the cache after update
      await refetch();
      return data;
    } catch (err) {
      setError(formatErrorMessage(err));
      throw err;
    }
  }, [patientId, refetch]);

  return {
    patient,
    isLoading,
    error,
    fetchPatient,
    updatePatient
  };
}
