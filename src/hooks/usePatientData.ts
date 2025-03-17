
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient, PatientDataState } from '@/types/patient';
import { mapToPatientStatus } from '@/types/patientTypes';

/**
 * Hook to fetch and manage patient data
 * Provides standardized loading states and error handling
 */
export function usePatientData(patientId?: string): PatientDataState<Patient> & { fetchPatient: () => Promise<void> } {
  const [state, setState] = useState<PatientDataState<Patient>>({
    data: null,
    isLoading: false,
    error: null
  });

  const fetchPatient = async () => {
    if (!patientId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;

      if (data) {
        // Ensure consistent data structure
        const patientWithConsistentFields: Patient = {
          ...data,
          status: mapToPatientStatus(data.status as string),
          name: `${data.first_name} ${data.last_name}`,
          phone_number: data.phone || null,
          phone: data.phone || null
        };
        
        setState({
          data: patientWithConsistentFields,
          isLoading: false,
          error: null
        });
      }
    } catch (err: any) {
      console.error('Error fetching patient:', err);
      setState({
        data: null,
        isLoading: false,
        error: err.message || 'Failed to fetch patient data'
      });
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  return {
    ...state,
    fetchPatient
  };
}
