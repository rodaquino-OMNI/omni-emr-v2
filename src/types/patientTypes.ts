
// Patient status types matching the database enum
export type PatientStatus = 'hospital' | 'home' | 'discharged' | 'critical' | 'stable' | 'improving';

// Basic patient interface
export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string | null;
  mrn: string;
  status: PatientStatus;
  is_assigned?: boolean;
  room_number?: string | null;
  age?: number;
  diagnosis?: string;
  name?: string; // For backward compatibility
}

// Helper function to map string status to PatientStatus type
export function mapToPatientStatus(status: string): PatientStatus {
  switch (status.toLowerCase()) {
    case 'hospital':
    case 'active':
      return 'hospital';
    case 'home':
      return 'home';
    case 'discharged':
    case 'inactive':
      return 'discharged';
    case 'critical':
      return 'critical';
    case 'improving':
      return 'improving';
    default:
      return 'stable';
  }
}
