
import { PatientStatus as PatientTypeStatus } from './patientTypes';

// Define patient status enum to match the PatientStatus in patientTypes
export type PatientStatus = PatientTypeStatus;

// Define common props for patient tabs
export interface PatientTabProps {
  patientId: string;
}

// Define props for patient view components
export interface PatientViewProps {
  patientId: string;
}

// Define patient interface
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  name?: string;
  date_of_birth: string;
  gender?: string; // Make gender optional to match with patientTypes
  status: PatientStatus;
  room_number?: string;
  mrn: string;
  phone?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  insurance?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_type?: string;
  is_assigned?: boolean;
  age?: number;
  height?: number;
  weight?: number;
  allergies?: string[];
  insights?: PatientInsight[];
  prescriptions?: Prescription[];
  identifiers?: any;
}

// Define AI Insight type for patient - making category a union type to match its usage
export interface PatientInsight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'warning' | 'info' | 'success';
  created_at: string;
  source: string;
  category: 'critical' | 'warning' | 'info' | 'success' | string;
  timestamp?: string; // Add timestamp property for backward compatibility
  patient_id?: string;
}

// Define component AI insight type
export interface ComponentAIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'warning' | 'info' | 'success';
  created_at: string;
  source: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  content?: string;
  patient_id?: string;
  timestamp?: string; // Add timestamp property for backward compatibility
}

// Export AIInsight as an alias for PatientInsight for backward compatibility
export type AIInsight = PatientInsight;

// Define vital signs type
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
  systolic_bp?: number; // For backward compatibility
  diastolic_bp?: number; // For backward compatibility
  o2_saturation?: number; // For backward compatibility
  weight?: number;
  height?: number;
  bmi?: number;
  pain_level?: number;
  notes?: string;
  recorded_by?: string;
  recorder_name?: string;
}

// Define prescription type
export interface Prescription {
  id: string;
  patient_id: string;
  provider_id: string;
  doctor_id?: string; // For backward compatibility
  status: string;
  created_at: string;
  updated_at?: string;
  notes?: string;
  items?: PrescriptionItem[];
  date?: string; // For backward compatibility
}

// Define prescription item type
export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  name: string;
  type: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  startDate?: string; // For backward compatibility
  end_date?: string;
  endDate?: string; // For backward compatibility
  instructions?: string;
  status: string;
}

// Define allergy type
export interface PatientAllergy {
  id: string;
  patient_id: string;
  allergen: string;
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  reaction: string;
  is_active: boolean;
}
