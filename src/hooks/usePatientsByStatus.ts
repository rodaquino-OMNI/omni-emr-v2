import { useQuery } from '@tanstack/react-query';
import { Patient } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { PatientStatus } from '@/types/patientTypes';

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
    data,
    criticalPatients,
    stablePatients,
    loading: isLoading,
    error
  };
};

// Utility function to filter patients by status
export const filterPatientsByStatus = (patients: Patient[], status: PatientStatus | PatientStatus[]): Patient[] => {
  if (!patients) return [];
  
  // If status is an array, filter patients whose status is in the array
  if (Array.isArray(status)) {
    return patients.filter(patient => status.includes(patient.status));
  }
  
  // Otherwise, filter patients with the matching status
  return patients.filter(patient => patient.status === status);
};
