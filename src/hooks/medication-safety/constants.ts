
// Define types for our medication safety features
export interface PatientAllergy {
  id: string;
  allergen: string;
  reaction?: string;
  severity?: string;
}

export interface MedicationSafetyCheck {
  isAllergyReviewed: boolean;
  hasAllergyWarning: boolean;
  allergyWarningDetails?: string[];
  isHighRiskMedication: boolean;
  isWeightBased: boolean;
  isWeightVerified: boolean;
  patientWeight?: number;
  weightLastUpdated?: Date;
  hasPassed: boolean;
}

// List of high-risk medications that require additional verification
export const HIGH_RISK_MEDICATIONS = [
  'warfarin', 'heparin', 'insulin', 'methotrexate', 'digoxin', 
  'morphine', 'fentanyl', 'hydromorphone', 'oxycodone',
  'chemotherapy', 'thrombolytics', 'potassium chloride',
  'vancomycin', 'amiodarone', 'lidocaine'
];

// List of weight-based medications
export const WEIGHT_BASED_MEDICATIONS = [
  'heparin', 'enoxaparin', 'insulin', 'vancomycin', 
  'gentamicin', 'tobramycin', 'amikacin'
];
