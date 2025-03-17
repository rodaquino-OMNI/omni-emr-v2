
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VitalSigns, PatientDataState } from '@/types/patient';

/**
 * Hook to fetch and manage patient vital signs
 * Uses standardized data structures and loading states
 */
export function usePatientVitals(patientId?: string): PatientDataState<VitalSigns[]> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<PatientDataState<VitalSigns[]>>({
    data: null,
    isLoading: false,
    error: null
  });

  const fetchVitals = async () => {
    if (!patientId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Map results to ensure consistent field naming
      const standardizedVitals: VitalSigns[] = data.map(vital => ({
        ...vital,
        systolic_bp: vital.systolic_bp || vital.blood_pressure_systolic,
        diastolic_bp: vital.diastolic_bp || vital.blood_pressure_diastolic,
        o2_saturation: vital.oxygen_saturation || vital.o2_saturation,
        recorded_by: vital.recorded_by || vital.taken_by
      }));

      setState({
        data: standardizedVitals,
        isLoading: false,
        error: null
      });
    } catch (err: any) {
      console.error('Error fetching vital signs:', err);
      setState({
        data: null,
        isLoading: false,
        error: err.message || 'Failed to fetch vital signs data'
      });
    }
  };

  useEffect(() => {
    fetchVitals();
  }, [patientId]);

  return {
    ...state,
    refetch: fetchVitals
  };
}
