
import { useState, useCallback } from 'react';
import { useTranslation } from '../useTranslation';
import { toast } from '../use-toast';
import { supabase } from '@/integrations/supabase/client';

export function usePatientWeight(patientId: string) {
  const { t } = useTranslation();
  const [patientWeight, setPatientWeight] = useState<number | undefined>(undefined);
  const [weightLastUpdated, setWeightLastUpdated] = useState<Date | undefined>(undefined);
  
  // Fetch patient's latest weight
  const fetchPatientWeight = useCallback(async () => {
    if (!patientId) return;
    
    try {
      // Get the most recent vital signs
      const { data, error } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      // If there's data, try to extract weight information from notes
      if (data && data.length > 0) {
        // Check if the notes contain weight information
        const notes = data[0].notes;
        if (notes && notes.includes('Patient weight:')) {
          // Extract weight from notes like "Patient weight: 75 kg"
          const weightMatch = notes.match(/Patient weight: (\d+\.?\d*) kg/);
          if (weightMatch && weightMatch[1]) {
            const weight = parseFloat(weightMatch[1]);
            setPatientWeight(weight);
            setWeightLastUpdated(new Date(data[0].timestamp));
          }
        }
      } else {
        console.log('No weight data found for patient');
      }
    } catch (error) {
      console.error('Error fetching patient weight:', error);
    }
  }, [patientId]);
  
  // Update patient weight
  const updatePatientWeight = async (weight: number) => {
    if (!patientId || !weight) return false;
    
    try {
      const timestamp = new Date().toISOString();
      const recorder_name = 'System'; // Default recorder name
      
      // Insert new vital signs record with weight stored in notes
      const { error } = await supabase
        .from('vital_signs')
        .insert({
          patient_id: patientId,
          recorder_name: recorder_name,
          notes: `Patient weight: ${weight} kg`,
          timestamp: timestamp
        });
      
      if (error) throw error;
      
      setPatientWeight(weight);
      setWeightLastUpdated(new Date());
      
      toast.success(t('success'), {
        description: t('weightUpdatedSuccessfully')
      });
      
      return true;
    } catch (error) {
      console.error('Error updating patient weight:', error);
      toast.error(t('error'), {
        description: t('errorUpdatingWeight')
      });
      return false;
    }
  };
  
  return {
    patientWeight,
    weightLastUpdated,
    fetchPatientWeight,
    updatePatientWeight
  };
}
