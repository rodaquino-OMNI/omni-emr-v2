
export interface PatientAllergy {
  id: string;
  patient_id: string;
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  reaction: string;
  is_active: boolean;
}

export interface MedicationSafetyCheck {
  isAllergyReviewed: boolean;
  hasAllergyWarning: boolean;
  allergyWarningDetails: PatientAllergy[];
  isHighRiskMedication: boolean;
  isWeightBased: boolean;
  isWeightVerified: boolean;
  patientWeight: number | null;
  weightLastUpdated: Date | null;
  hasPassed: boolean;
}

// Add the missing exports
export const HIGH_RISK_MEDICATIONS = [
  'warfarin',
  'heparin',
  'insulin',
  'digoxin',
  'morphine',
  'fentanyl',
  'hydromorphone',
  'methotrexate',
  'potassium chloride',
  'chemotherapy agents'
];

export const WEIGHT_BASED_MEDICATIONS = [
  'acyclovir',
  'amikacin',
  'amphotericin B',
  'cefepime',
  'gentamicin',
  'vancomycin',
  'enoxaparin',
  'heparin',
  'insulin'
];
