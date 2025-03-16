
export enum PatientStatus {
  Active = 'active',
  Discharged = 'discharged',
  Inactive = 'inactive',
  Scheduled = 'scheduled',
  OnLeave = 'on_leave',
  Critical = 'critical',
  Stable = 'stable',
  Unknown = 'unknown'
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
