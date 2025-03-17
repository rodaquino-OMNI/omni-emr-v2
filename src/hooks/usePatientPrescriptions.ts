
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Prescription, PatientDataState } from '@/types/patient';
import { transformPrescription } from '@/services/prescriptions/transformUtils';

/**
 * Hook to fetch and manage patient prescriptions
 * Uses standardized data structures and loading states
 */
export function usePatientPrescriptions(patientId?: string): PatientDataState<Prescription[]> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<PatientDataState<Prescription[]>>({
    data: null,
    isLoading: false,
    error: null
  });

  const fetchPrescriptions = async () => {
    if (!patientId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform prescriptions using the service utility
      const transformedPrescriptions = await Promise.all(
        data.map(async (prescription) => {
          try {
            return await transformPrescription(prescription);
          } catch (err) {
            console.error(`Error transforming prescription ${prescription.id}:`, err);
            return null;
          }
        })
      );

      // Filter out null values (failed transformations)
      const validPrescriptions = transformedPrescriptions.filter(p => p !== null) as Prescription[];

      setState({
        data: validPrescriptions,
        isLoading: false,
        error: null
      });
    } catch (err: any) {
      console.error('Error fetching prescriptions:', err);
      setState({
        data: null,
        isLoading: false,
        error: err.message || 'Failed to fetch prescription data'
      });
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  return {
    ...state,
    refetch: fetchPrescriptions
  };
}
