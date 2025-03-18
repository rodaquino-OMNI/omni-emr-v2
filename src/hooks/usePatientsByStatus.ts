
import { useQuery } from '@tanstack/react-query';
import { Patient } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { PatientStatus } from '@/types/patientTypes';

// Create a proper hook that returns the expected structure
export const usePatientsByStatus = (sectorId?: string) => {
  const fetchPatients = async () => {
    let query = supabase
      .from('patients')
      .select('*');
    
    if (sectorId) {
      query = query.eq('sector_id', sectorId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data as Patient[];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['patients', sectorId],
    queryFn: fetchPatients
  });

  // Filter patients by status
  const criticalPatients = data?.filter(p => 
    p.status === 'critical' || p.status === 'hospital'
  ) || [];
  
  const stablePatients = data?.filter(p => 
    p.status === 'stable' || p.status === 'improving'
  ) || [];

  return {
    criticalPatients,
    stablePatients,
    loading: isLoading,
    error
  };
};
