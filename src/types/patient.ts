export type PatientStatus = 'stable' | 'unstable' | 'critical';

export const mapToPatientStatus = (status: string): PatientStatus => {
  switch (status) {
    case 'stable':
      return 'stable';
    case 'unstable':
      return 'unstable';
    case 'critical':
      return 'critical';
    default:
      return 'stable';
  }
};

export type InsightType = 'warning' | 'critical' | 'positive' | 'neutral';

export interface AIInsight {
  id: string;
  patient_id: string;
  title: string;
  content: string;
  description?: string; // Make optional to match ComponentAIInsight
  category: string;
  severity: 'high' | 'medium' | 'low';
  created_at: string;
  source?: string;
  timestamp?: string;
  type?: InsightType;
}

export interface PatientInsight {
  id: string;
  title: string;
  content: string;
  description?: string;
  type: InsightType;
  timestamp?: string;
  source?: string;
}

export interface ComponentAIInsight {
  id: string;
  title: string;
  content: string;
  description?: string;
  type: "info" | "warning" | "critical" | "success";
  source?: string;
  timestamp?: string;
}

// Make sure Patient includes insights
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
  insurance_provider?: string;
  insurance_id?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  primary_provider_id?: string;
  status: PatientStatus;
  mrn?: string;
  insights?: (AIInsight | PatientInsight)[];
  is_assigned?: boolean;
  height?: number;
  weight?: number;
  blood_type?: string;
  allergies?: string[];
  medications?: string[];
  prescriptions?: any[];
}
