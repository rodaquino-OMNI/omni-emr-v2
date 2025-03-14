
import { HIGH_RISK_MEDICATIONS, WEIGHT_BASED_MEDICATIONS, MedicationSafetyCheck } from './constants';

export function useMedicationChecks() {
  // Check if medication is high risk
  const isHighRiskMedication = (medicationName: string): boolean => {
    if (!medicationName) return false;
    
    const medNameLower = medicationName.toLowerCase();
    return HIGH_RISK_MEDICATIONS.some(drug => medNameLower.includes(drug));
  };
  
  // Check if medication requires weight-based dosing
  const isWeightBasedMedication = (medicationName: string): boolean => {
    if (!medicationName) return false;
    
    const medNameLower = medicationName.toLowerCase();
    return WEIGHT_BASED_MEDICATIONS.some(drug => medNameLower.includes(drug));
  };
  
  return {
    isHighRiskMedication,
    isWeightBasedMedication
  };
}
