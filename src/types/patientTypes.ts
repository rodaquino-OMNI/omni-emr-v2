// Define patient status enum
export type PatientStatus = 'active' | 'inactive' | 'discharged' | 'critical' | 'stable' | 'hospital' | 'home' | 'improving';

// Define patient type
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null;

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string | null;
  mrn: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  insurance: string | null;
  allergies?: string[];
  status: PatientStatus;
  blood_type: BloodType;
  is_assigned?: boolean;
  name?: string;
  room_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  age?: number;
  identifiers?: any;
}

export interface PatientVital {
  id: string;
  patientId: string;
  timestamp: string;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
}

export interface VitalSigns {
  id: string;
  patient_id: string;
  timestamp: string;
  temperature?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  oxygen_saturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  taken_by?: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  o2_saturation?: number;
}

export interface Diagnosis {
  id: string;
  patient_id: string;
  name: string;
  code?: string;
  icd_code?: string;
  date: string;
  type: string;
  status: string;
  notes?: string;
  diagnosed_by?: string;
  diagnosis?: string;
}

export interface PatientAllergy {
  id: string;
  patient_id: string;
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  reaction: string;
  is_active: boolean;
}

export interface InitialFilterOptions {
  status?: string;
  location?: string;
  careTeam?: string;
  searchTerm?: string;
}

export interface MedicalHistoryEntry {
  id: string;
  patient_id: string;
  title: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  type: string;
  provider_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface Allergy {
  id: string;
  patient_id: string;
  allergen: string;
  reaction?: string;
  severity: string;
  status: string;
  onset_date?: string;
  recorded_date: string;
  recorder_id?: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  provider_id: string;
  status: string;
  created_at: string;
  updated_at?: string;
  notes?: string;
  items?: PrescriptionItem[];
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  name: string;
  type: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  instructions?: string;
  status: string;
}

// Helper function to map string to PatientStatus
export const mapToPatientStatus = (status: string): PatientStatus => {
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'active':
      return 'active';
    case 'inactive':
      return 'inactive';
    case 'discharged':
      return 'discharged';
    case 'critical':
      return 'critical';
    case 'stable':
      return 'stable';
    case 'hospital':
      return 'hospital';
    case 'home':
      return 'home';
    case 'improving':
      return 'improving';
    default:
      return 'active';
  }
};
