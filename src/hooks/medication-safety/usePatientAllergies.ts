
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PatientAllergy } from './constants';

export function usePatientAllergies(patientId: string) {
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [isLoadingAllergies, setIsLoadingAllergies] = useState(false);
  const [isAllergyReviewed, setIsAllergyReviewed] = useState(false);
  
  // Fetch allergies for a patient
  const fetchPatientAllergies = useCallback(async () => {
    if (!patientId) return;
    
    setIsLoadingAllergies(true);
    try {
      const { data, error } = await supabase
        .from('allergies')
        .select('*')
        .eq('patient_id', patientId)
        .eq('is_active', true);
        
      if (error) throw error;
      
      setAllergies(data || []);
      
      // Check if allergies have been reviewed
      if (data && data.length > 0) {
        setIsAllergyReviewed(true);
      } else {
        // If no allergies are found, we should still check if 
        // the "no allergies" status has been explicitly confirmed
        const { data: allergyStatus, error: statusError } = await supabase
          .from('patient_allergy_status')
          .select('*')
          .eq('patient_id', patientId)
          .maybeSingle();
          
        if (!statusError && allergyStatus) {
          setIsAllergyReviewed(allergyStatus.reviewed_at !== null);
        }
      }
    } catch (error) {
      console.error('Error fetching allergies:', error);
    } finally {
      setIsLoadingAllergies(false);
    }
  }, [patientId]);
  
  // Mark allergies as reviewed
  const markAllergiesReviewed = useCallback(async () => {
    if (!patientId) return;
    
    try {
      const { data, error } = await supabase
        .from('patient_allergy_status')
        .upsert({
          patient_id: patientId,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select();
        
      if (error) throw error;
      
      setIsAllergyReviewed(true);
      return data;
    } catch (error) {
      console.error('Error marking allergies as reviewed:', error);
      throw error;
    }
  }, [patientId]);
  
  // Check medication name against patient allergies
  const checkAllergies = useCallback((medicationName: string): PatientAllergy[] => {
    if (!medicationName || !allergies.length) return [];
    
    const medName = medicationName.toLowerCase();
    
    // Basic algorithm to detect potential allergies
    // In a production environment, this would be much more sophisticated
    // using medication ingredients and proper allergen mapping
    return allergies.filter(allergy => {
      const allergenName = allergy.allergen.toLowerCase();
      
      // Direct match
      if (medName.includes(allergenName) || allergenName.includes(medName)) {
        return true;
      }
      
      // Class-based matches (simple example)
      if (
        (allergenName.includes('penicillin') && 
          (medName.includes('amoxicillin') || 
           medName.includes('ampicillin') || 
           medName.includes('carbenicillin'))) ||
        (allergenName.includes('sulfa') && medName.includes('sulfa')) ||
        (allergenName.includes('nsaid') && 
          (medName.includes('ibuprofen') || 
           medName.includes('naproxen') || 
           medName.includes('aspirin'))) ||
        (allergenName.includes('statin') && medName.endsWith('statin'))
      ) {
        return true;
      }
      
      return false;
    });
  }, [allergies]);
  
  return {
    allergies,
    isLoadingAllergies,
    isAllergyReviewed,
    fetchPatientAllergies,
    markAllergiesReviewed,
    checkAllergies
  };
}
