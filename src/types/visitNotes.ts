
export interface VisitNote {
  id: string;
  title: string;
  content?: string;
  created_at: string;
  updated_at?: string;
  patient_id: string;
  provider_id: string;
  status: 'draft' | 'completed' | 'in_progress' | 'cancelled';
  treatment_plan?: string;
  follow_up?: string;
  diagnosis?: Array<{
    code: string;
    description: string;
  }>;
  patient?: {
    id: string;
    name?: string;
    date_of_birth?: string;
    gender?: string;
  };
  provider?: {
    id: string;
    name?: string;
  };
}

export interface VitalSigns {
  id?: string;
  timestamp: string;
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressure?: string;
  oxygenSaturation?: number;
  pain?: number;
}
