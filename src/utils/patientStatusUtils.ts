
import { PatientStatus } from '@/types/patientTypes';

/**
 * Converts a string to a valid PatientStatus type
 * 
 * @param status Status string from any source
 * @returns Valid PatientStatus enum value
 */
export function convertToPatientStatus(status: string): PatientStatus {
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
    case 'stable':
    default:
      return 'stable';
  }
}

/**
 * Returns status color class based on patient status
 * 
 * @param status Patient status
 * @returns Tailwind color class
 */
export function getStatusColorClass(status: PatientStatus): string {
  switch (status) {
    case 'critical':
      return 'text-red-500 bg-red-100';
    case 'hospital':
      return 'text-blue-500 bg-blue-100';
    case 'improving':
      return 'text-green-500 bg-green-100';
    case 'stable':
      return 'text-emerald-500 bg-emerald-100';
    case 'home':
      return 'text-amber-500 bg-amber-100';
    case 'discharged':
      return 'text-gray-500 bg-gray-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}

/**
 * Returns a user-friendly status label based on patient status
 * 
 * @param status Patient status
 * @param language Current language (en/pt)
 * @returns User-friendly status label
 */
export function getStatusLabel(status: PatientStatus, language: string = 'en'): string {
  if (language === 'pt') {
    switch (status) {
      case 'critical':
        return 'Crítico';
      case 'hospital':
        return 'Hospitalizado';
      case 'improving':
        return 'Melhorando';
      case 'stable':
        return 'Estável';
      case 'home':
        return 'Em Casa';
      case 'discharged':
        return 'Alta';
      default:
        return 'Desconhecido';
    }
  } else {
    switch (status) {
      case 'critical':
        return 'Critical';
      case 'hospital':
        return 'Hospitalized';
      case 'improving':
        return 'Improving';
      case 'stable':
        return 'Stable';
      case 'home':
        return 'At Home';
      case 'discharged':
        return 'Discharged';
      default:
        return 'Unknown';
    }
  }
}
