
import { useState, useCallback } from 'react';
import { useTranslation } from '../useTranslation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PatientAllergy } from './constants';
import { isPenicillinFamily, isSulfaFamily, isNSAID } from './medicationFamilies';

export function usePatientAllergies(patientId: string) {
  const { t } = useTranslation();
  const [allergies, setAllergies] = useState<PatientAllergy[]>([]);
  const [isLoadingAllergies, setIsLoadingAllergies] = useState(false);
  const [isAllergyReviewed, setIsAllergyReviewed] = useState(false);
  
  // Fetch patient allergies
  const fetchPatientAllergies = useCallback(async () => {
    if (!patientId) return;
    
    setIsLoadingAllergies(true);
    try {
      const { data, error } = await supabase
        .from('allergies')
        .select('id, allergen, reaction, severity')
        .eq('patient_id', patientId)
        .eq('is_active', true);
      
      if (error) throw error;
      setAllergies(data || []);
    } catch (error) {
      console.error('Error fetching patient allergies:', error);
      toast.error(t('errorFetchingAllergies'));
    } finally {
      setIsLoadingAllergies(false);
    }
  }, [patientId, t]);
  
  // Mark allergies as reviewed for this session
  const markAllergiesReviewed = () => {
    setIsAllergyReviewed(true);
    return true;
  };
  
  // Check if medication matches patient allergies
  const checkAllergies = (medicationName: string): string[] => {
    if (!medicationName || !allergies.length) return [];
    
    const medNameLower = medicationName.toLowerCase();
    const warnings: string[] = [];
    
    allergies.forEach(allergy => {
      const allergenLower = allergy.allergen.toLowerCase();
      
      // Check for direct match or common allergen groups
      if (
        medNameLower.includes(allergenLower) || 
        (allergenLower === 'penicillin' && isPenicillinFamily(medNameLower)) ||
        (allergenLower === 'sulfa' && isSulfaFamily(medNameLower)) ||
        (allergenLower === 'nsaid' && isNSAID(medNameLower))
      ) {
        warnings.push(`${allergy.allergen} (${allergy.severity || 'unknown severity'})`);
      }
    });
    
    return warnings;
  };
  
  return {
    allergies,
    isLoadingAllergies,
    isAllergyReviewed,
    fetchPatientAllergies,
    markAllergiesReviewed,
    checkAllergies
  };
}
