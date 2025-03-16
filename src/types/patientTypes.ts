
export enum PatientStatus {
  Active = 'active',
  Discharged = 'discharged',
  Inactive = 'inactive',
  Scheduled = 'scheduled',
  OnLeave = 'on_leave',
  Critical = 'critical',
  Stable = 'stable',
  Unknown = 'unknown',
  // Add these to fix type errors in components
  Hospital = 'hospital',
  Home = 'home',
  Improving = 'improving'
}

export enum BloodType {
  APositive = 'A+',
  ANegative = 'A-',
  BPositive = 'B+',
  BNegative = 'B-',
  ABPositive = 'AB+',
  ABNegative = 'AB-',
  OPositive = 'O+',
  ONegative = 'O-',
  Unknown = 'Unknown'
}

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
  status: PatientStatus;
  room_number: string | null;
  blood_type: BloodType | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  is_assigned?: boolean;
  // Add name and age properties to fix component errors
  name?: string;
  age?: number;
}

export interface PatientVitals {
  id: string;
  patientId: string;
  timestamp: string;
  temperature?: number;
  temperatureUnit?: string;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  painLevel?: number;
}

export interface PatientInsight {
  id: string;
  type: 'alert' | 'insight' | 'recommendation';
  title: string;
  description: string;
  source: string;
  date: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'new' | 'seen' | 'acknowledged' | 'resolved';
  category: string;
  relatedData?: any;
  icon?: string;
}

export interface MedicalHistoryEntry {
  id: string;
  patientId: string;
  title: string;
  entryDate: string;
  providerName: string;
  providerId: string;
  notes?: string;
}

// Add missing types that are imported elsewhere
export interface VitalSigns {
  id: string;
  patientId: string;
  date: string;
  temperature?: number;
  heartRate?: number;
  bloodPressure?: string;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  onsetDate?: string;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  condition: string;
  date: string;
  status: 'active' | 'resolved' | 'recurrence';
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Helper function for patient status mapping
export const mapToPatientStatus = (status: string): PatientStatus => {
  if (Object.values(PatientStatus).includes(status as PatientStatus)) {
    return status as PatientStatus;
  }
  return PatientStatus.Unknown;
};
