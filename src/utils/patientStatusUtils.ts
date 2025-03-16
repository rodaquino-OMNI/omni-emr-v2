
import { PatientStatus } from '@/types/patientTypes';

/**
 * Safely converts a string status value to the PatientStatus enum type
 * This provides a central location for status mapping logic
 */
export const convertToPatientStatus = (status: string | null | undefined): PatientStatus => {
  if (!status) return 'stable';
  
  const normalizedStatus = status.toLowerCase();
  
  switch (normalizedStatus) {
    case 'hospital':
    case 'active':
    case 'inpatient':
      return 'hospital';
      
    case 'home':
    case 'outpatient':
      return 'home';
      
    case 'discharged':
    case 'inactive':
    case 'released':
      return 'discharged';
      
    case 'critical':
    case 'urgent':
    case 'emergency':
      return 'critical';
      
    case 'improving':
    case 'recovering':
      return 'improving';
      
    case 'stable':
    default:
      return 'stable';
  }
};

/**
 * Checks if a string is a valid PatientStatus
 */
export const isValidPatientStatus = (status: string): boolean => {
  const validStatuses: PatientStatus[] = [
    'hospital', 'home', 'discharged', 'critical', 'stable', 'improving'
  ];
  return validStatuses.includes(status as PatientStatus);
};

/**
 * Gets display text for a patient status
 */
export const getPatientStatusDisplay = (status: PatientStatus): string => {
  switch (status) {
    case 'hospital': return 'In Hospital';
    case 'home': return 'At Home';
    case 'discharged': return 'Discharged';
    case 'critical': return 'Critical';
    case 'improving': return 'Improving';
    case 'stable': return 'Stable';
    default: return 'Unknown';
  }
};
