
import { useEffect } from 'react';
import { usePatientAllergies } from './medication-safety/usePatientAllergies';
import { usePatientWeight } from './medication-safety/usePatientWeight';
import { useMedicationChecks } from './medication-safety/useMedicationChecks';
import { MedicationSafetyCheck, PatientAllergy } from './medication-safety/constants';

export type { PatientAllergy, MedicationSafetyCheck };

export function useMedicationSafety(patientId: string) {
  // Composing specialized hooks
  const {
    allergies,
    isLoadingAllergies,
    isAllergyReviewed,
    fetchPatientAllergies,
    markAllergiesReviewed,
    checkAllergies
  } = usePatientAllergies(patientId);
  
  const {
    patientWeight,
    weightLastUpdated,
    fetchPatientWeight,
    updatePatientWeight
  } = usePatientWeight(patientId);
  
  const {
    isHighRiskMedication,
    isWeightBasedMedication
  } = useMedicationChecks();
  
  // Perform comprehensive medication safety check
  const performSafetyCheck = (medicationName: string): MedicationSafetyCheck => {
    const allergyWarnings = checkAllergies(medicationName);
    const isHighRisk = isHighRiskMedication(medicationName);
    const isWeightBased = isWeightBasedMedication(medicationName);
    
    // Weight is considered verified if it exists and was updated in the last 7 days
    const isWeightVerified = !!(
      patientWeight && 
      weightLastUpdated && 
      (new Date().getTime() - weightLastUpdated.getTime() < 7 * 24 * 60 * 60 * 1000)
    );
    
    // Safety check passes if:
    // 1. Allergies have been reviewed AND
    // 2. No allergy warnings exist AND
    // 3. If weight-based medication, weight is verified
    const hasPassed = 
      isAllergyReviewed && 
      allergyWarnings.length === 0 && 
      (!isWeightBased || isWeightVerified);
    
    return {
      isAllergyReviewed,
      hasAllergyWarning: allergyWarnings.length > 0,
      allergyWarningDetails: allergyWarnings,
      isHighRiskMedication: isHighRisk,
      isWeightBased,
      isWeightVerified,
      patientWeight,
      weightLastUpdated,
      hasPassed
    };
  };
  
  // Load patient data on initial mount
  useEffect(() => {
    if (patientId) {
      fetchPatientAllergies();
      fetchPatientWeight();
    }
  }, [patientId, fetchPatientAllergies, fetchPatientWeight]);
  
  return {
    allergies,
    isLoadingAllergies,
    patientWeight,
    weightLastUpdated,
    isAllergyReviewed,
    updatePatientWeight,
    markAllergiesReviewed,
    performSafetyCheck,
  };
}
