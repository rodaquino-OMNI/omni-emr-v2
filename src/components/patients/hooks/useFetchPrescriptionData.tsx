
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFetchPrescriptionData = () => {
  /**
   * Fetch prescription data from FHIR medication_requests table
   */
  const fetchFHIRData = useCallback(async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('medication_requests')
        .select('*, requester:requester_id(name)')
        .eq('subject_id', patientId)
        .order('authored_on', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching FHIR medication requests:', error);
      return [];
    }
  }, []);
  
  /**
   * Fetch prescription data from legacy prescriptions table
   */
  const fetchLegacyData = useCallback(async (patientId: string) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          id, 
          date, 
          status, 
          notes,
          prescription_items(id, name, dosage, frequency, duration, instructions, start_date, end_date, status)
        `)
        .eq('patient_id', patientId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching legacy prescriptions:', error);
      return [];
    }
  }, []);
  
  return { fetchFHIRData, fetchLegacyData };
};
