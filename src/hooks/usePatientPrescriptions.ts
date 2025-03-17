
import { useSupabaseQuery } from './api/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { Prescription } from '@/types/patientTypes';

/**
 * Hook for fetching patient prescriptions with caching
 */
export function usePatientPrescriptions(patientId?: string) {
  return useSupabaseQuery<Prescription[]>(
    ['patientPrescriptions', patientId || ''],
    async () => {
      if (!patientId) return [];

      // Fetch prescriptions for patient
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          items:prescription_items(*)
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match our Prescription type
      return (data || []).map(prescription => ({
        id: prescription.id,
        patient_id: prescription.patient_id,
        provider_id: prescription.provider_id,
        status: prescription.status,
        created_at: prescription.created_at,
        items: prescription.items || []
      })) as Prescription[];
    },
    {
      enabled: !!patientId
    }
  );
}
