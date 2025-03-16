
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePatientWeight(patientId: string) {
  const [patientWeight, setPatientWeight] = useState<number | null>(null);
  const [weightLastUpdated, setWeightLastUpdated] = useState<Date | null>(null);
  
  // Fetch the patient's latest weight
  const fetchPatientWeight = useCallback(async () => {
    if (!patientId) return;
    
    try {
      const { data, error } = await supabase
        .from('vital_signs')
        .select('weight, timestamp')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data && data.weight) {
        setPatientWeight(data.weight);
        setWeightLastUpdated(new Date(data.timestamp));
      }
    } catch (error) {
      console.error('Error fetching patient weight:', error);
    }
  }, [patientId]);
  
  // Update patient weight
  const updatePatientWeight = useCallback(async (weight: number) => {
    if (!patientId || !weight) return;
    
    try {
      const timestamp = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('vital_signs')
        .insert({
          patient_id: patientId,
          weight,
          timestamp
        })
        .select();
        
      if (error) throw error;
      
      setPatientWeight(weight);
      setWeightLastUpdated(new Date(timestamp));
      
      return data;
    } catch (error) {
      console.error('Error updating patient weight:', error);
      throw error;
    }
  }, [patientId]);
  
  return {
    patientWeight,
    weightLastUpdated,
    fetchPatientWeight,
    updatePatientWeight
  };
}
