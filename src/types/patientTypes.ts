
// Define patient status enum
export enum PatientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCHARGED = 'discharged',
  CRITICAL = 'critical',
  STABLE = 'stable',
  HOSPITAL = 'hospital',
  HOME = 'home',
  IMPROVING = 'improving'
}

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
  // Alias properties for compatibility with different naming conventions
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
