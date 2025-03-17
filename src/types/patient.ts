// Core patient interface that standardizes the patient model across components
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  name?: string; // Computed full name (first_name + last_name)
  date_of_birth: string;
  gender: string | null;
  mrn: string;
  email: string | null;
  phone_number?: string;
  phone?: string | null; // Alias for phone_number for compatibility
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  country: string | null;
  insurance: string | null;
  allergies?: string[] | PatientAllergy[];
  status: PatientStatus;
  blood_type: BloodType;
  is_assigned?: boolean;
  room_number?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  age?: number;
  identifiers?: any;
  sectors?: Array<{ id: string; name: string }>;
}

// Standardized interface for all patient-related data loading states
export interface PatientDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | string | null;
}

// Standardized patient allergy interface
export interface PatientAllergy {
  id: string;
  patient_id: string;
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  reaction: string;
  is_active: boolean;
}

// Standardized prescription interface
export interface Prescription {
  id: string;
  patient_id: string;
  patientName?: string;
  provider_id: string;
  doctorId?: string; // Alias for provider_id for compatibility
  doctorName?: string;
  date: string;
  created_at?: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  items?: PrescriptionItem[];
}

// Standardized prescription item interface
export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  name: string;
  type: 'medication' | 'procedure' | 'lab_test' | 'imaging';
  details?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  startDate?: string; // Alias for start_date for compatibility
  endDate?: string; // Alias for end_date for compatibility
  status: 'pending' | 'completed' | 'cancelled';
  instructions?: string;
}

// Standardized vital signs interface
export interface VitalSigns {
  id: string;
  patient_id: string;
  timestamp: string;
  temperature?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  systolic_bp?: number; // Alias for blood_pressure_systolic for compatibility
  diastolic_bp?: number; // Alias for blood_pressure_diastolic for compatibility
  oxygen_saturation?: number;
  o2_saturation?: number; // Alias for oxygen_saturation for compatibility
  weight?: number;
  height?: number;
  bmi?: number;
  pain_level?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  taken_by?: string;
  recorded_by?: string; // Alias for taken_by for compatibility
  recorder_name?: string;
}

// Standardized patient tab component props
export interface PatientTabProps {
  patientId: string;
}

// Standardized loading state props for components
export interface LoadingStateProps {
  isLoading: boolean;
  error?: Error | string | null;
}

// AI Insights
export interface AIInsight {
  id: string;
  patient_id: string;
  category: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  source?: string;
  action_required?: boolean;
  action_description?: string;
}

// Standardized interface for patient view props
export interface PatientViewProps {
  patientId: string;
}

// Export PatientStatus enum from this file for consistency
export type PatientStatus = 'active' | 'inactive' | 'discharged' | 'critical' | 'stable' | 'hospital' | 'home' | 'improving';

// Export BloodType enum for consistency
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | null;
