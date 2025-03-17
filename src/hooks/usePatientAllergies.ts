
import { useSupabaseQuery } from './api/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { Allergy } from '@/types/patient';

/**
 * Hook for fetching patient allergies with caching
 */
export function usePatientAllergies(patientId?: string) {
  return useSupabaseQuery<Allergy[]>(
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
      
      return data as Allergy[];
    },
    {
      enabled: !!patientId,
      staleTime: 10 * 60 * 1000, // 10 minutes (allergies don't change frequently)
      gcTime: 30 * 60 * 1000 // 30 minutes
    }
  );
}
