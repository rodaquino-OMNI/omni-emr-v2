
// Patient status types
export type PatientStatus = 'stable' | 'critical' | 'improving' | 'discharged' | 'hospital' | 'home';

// Patient gender types
export type PatientGender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// Patient blood types
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';

// Patient model interface
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
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
  updated_at: string;
  room_number: string | null;
  status: PatientStatus | null;
  blood_type: BloodType | null;
}

// Vitals interface
export interface VitalSigns {
  id: string;
  patient_id: string;
  timestamp: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  temperature?: number;
  temperature_unit?: 'C' | 'F';
  oxygen_saturation?: number;
  pain_level?: number;
  notes?: string;
  recorder_name: string;
  recorded_by?: string;
  created_at: string;
}

// Medical history entry
export interface MedicalHistoryEntry {
  id: string;
  patient_id: string;
  title: string;
  notes?: string;
  entry_date: string;
  provider_id: string;
  provider_name: string;
  created_at: string;
}

// Allergy interface
export interface Allergy {
  id: string;
  patient_id: string;
  allergen: string;
  severity?: string;
  reaction?: string;
  date_identified?: string;
  notes?: string;
  recorder_name: string;
  recorded_by?: string;
  created_at: string;
  is_active?: boolean;
}

// Diagnosis interface
export interface Diagnosis {
  id: string;
  patient_id: string;
  diagnosis: string;
  icd_code?: string;
  diagnosed_date?: string;
  diagnosed_by?: string;
  diagnostician_name: string;
  notes?: string;
  status?: string;
  created_at: string;
}

// Medication prescription interface
export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  date: string;
  notes?: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending' | 'on-hold';
  created_at: string;
  updated_at: string;
}

// Prescription item interface
export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  name: string;
  type: 'medication' | 'procedure' | 'supply';
  details?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  start_date?: string;
  end_date?: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending' | 'on-hold';
  created_at: string;
}
