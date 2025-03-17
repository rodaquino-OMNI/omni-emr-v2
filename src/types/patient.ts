
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

// Define AI Insight type for patient
export interface PatientInsight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
  source: string;
  category: 'critical' | 'warning' | 'info' | 'success';
}

// Define component AI insight type
export interface ComponentAIInsight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
  source: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  content?: string;
  patient_id?: string;
}

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
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
}

// Define prescription type
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
  end_date?: string;
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
