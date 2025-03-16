
import { Patient } from '@/types/patientTypes';

/**
 * Calculate the patient's age from date of birth
 */
export const calculatePatientAge = (patient: Patient): number => {
  if (!patient.date_of_birth) return 0;
  
  const birthDate = new Date(patient.date_of_birth);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Get the patient's full name
 */
export const getPatientFullName = (patient: Patient): string => {
  if (patient.name) return patient.name;
  return `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
};

/**
 * Format patient status for display
 */
export const formatPatientStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'discharged':
      return 'Discharged';
    case 'inactive':
      return 'Inactive';
    case 'scheduled':
      return 'Scheduled';
    case 'on_leave':
      return 'On Leave';
    case 'critical':
      return 'Critical';
    case 'stable':
      return 'Stable';
    case 'hospital':
      return 'In Hospital';
    case 'home':
      return 'At Home';
    case 'improving':
      return 'Improving';
    default:
      return 'Unknown';
  }
};
