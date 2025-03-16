
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFetchPrescriptionData = () => {
  // Memoize fetch functions to prevent recreation on each render
  const fetchFHIRData = useCallback(async (patientId: string) => {
    try {
      // Only select the fields we need rather than selecting everything
      const requiredFields = 'id,status,intent,subject,medication,dosage_instruction,dispense_request,authored_on';
      
      const { data, error } = await supabase
        .from('medication_requests')
        .select(requiredFields)
        .eq('subject_id', patientId)
        .order('authored_on', { ascending: false })
        .limit(50); // Limit to prevent excessive data fetching
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching FHIR prescriptions:', error);
      return [];
    }
  }, []);
  
  const fetchLegacyData = useCallback(async (patientId: string) => {
    try {
      // Only select fields we actually need
      const requiredFields = 'id,patient_id,provider_id,status,created_at,prescription_items(id,name,dosage,frequency,duration,status,type)';
      
      const { data, error } = await supabase
        .from('prescriptions')
        .select(requiredFields)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to prevent excessive data fetching
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching legacy prescriptions:', error);
      return [];
    }
  }, []);

  return { fetchFHIRData, fetchLegacyData };
};
