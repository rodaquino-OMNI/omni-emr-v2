
import { useSupabaseQuery } from './api/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { VitalSigns } from '@/types/patient';

/**
 * Hook for fetching patient vital signs with caching
 */
export function usePatientVitals(patientId?: string) {
  return useSupabaseQuery<VitalSigns[]>(
    ['patientVitals', patientId || ''],
    async () => {
      if (!patientId) return [];

      // Fetch vital signs for patient
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      return data as VitalSigns[];
    },
    {
      enabled: !!patientId,
      staleTime: 2 * 60 * 1000, // 2 minutes (vitals may update frequently)
      gcTime: 10 * 60 * 1000 // 10 minutes
    }
  );
}
