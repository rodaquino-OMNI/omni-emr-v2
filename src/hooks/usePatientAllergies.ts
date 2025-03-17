
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PatientAllergy, PatientDataState } from '@/types/patient';

/**
 * Hook to fetch and manage patient allergies
 * Uses standardized data structures and loading states
 */
export function usePatientAllergies(patientId?: string): PatientDataState<PatientAllergy[]> & { 
  refetch: () => Promise<void> 
} {
  const [state, setState] = useState<PatientDataState<PatientAllergy[]>>({
    data: null,
    isLoading: false,
    error: null
  });

  const fetchAllergies = async () => {
    if (!patientId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setState({
        data: data as PatientAllergy[],
        isLoading: false,
        error: null
      });
    } catch (err: any) {
      console.error('Error fetching allergies:', err);
      setState({
        data: null,
        isLoading: false,
        error: err.message || 'Failed to fetch allergy data'
      });
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, [patientId]);

  return {
    ...state,
    refetch: fetchAllergies
  };
}
