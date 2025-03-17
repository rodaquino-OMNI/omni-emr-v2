
import { useSupabaseQuery } from './api/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';
import { Patient, PatientStatus } from '@/types/patientTypes';

export function usePatientsByStatus(status?: PatientStatus | PatientStatus[]) {
  const statusArray = status ? (Array.isArray(status) ? status : [status]) : [];
  const statusKey = statusArray.join(',');

  return useSupabaseQuery<Patient[]>(
    ['patientsByStatus', statusKey],
    async () => {
      let query = supabase.from('patients').select('*');
      
      // Apply status filter if provided
      if (statusArray.length > 0) {
        query = query.in('status', statusArray);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      return data as Patient[];
    },
    {
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  );
}

export default usePatientsByStatus;
