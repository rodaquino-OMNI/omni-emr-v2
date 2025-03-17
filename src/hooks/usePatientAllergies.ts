
import { useSupabaseQuery } from './api/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { PatientAllergy } from '@/types/patientTypes';

/**
 * Hook for fetching patient allergies with caching
 */
export function usePatientAllergies(patientId?: string) {
  return useSupabaseQuery<PatientAllergy[]>(
    ['patientAllergies', patientId || ''],
    async () => {
      if (!patientId) return [];

      // Fetch allergies for patient
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data as PatientAllergy[];
    },
    {
      enabled: !!patientId
    }
  );
}
