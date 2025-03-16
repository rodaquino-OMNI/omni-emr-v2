
import { PatientStatus } from '../types/patientTypes';

/**
 * Maps a string status to enum PatientStatus
 */
export const mapToPatientStatus = (status: string): PatientStatus => {
  switch (status.toLowerCase()) {
    case 'active':
      return PatientStatus.Active;
    case 'discharged':
      return PatientStatus.Discharged;
    case 'inactive':
      return PatientStatus.Inactive;
    case 'scheduled':
      return PatientStatus.Scheduled;
    case 'on_leave':
      return PatientStatus.OnLeave;
    case 'critical':
      return PatientStatus.Critical;
    case 'stable':
      return PatientStatus.Stable;
    default:
      return PatientStatus.Unknown;
  }
};

/**
 * Converts a string to PatientStatus
 */
export const convertToPatientStatus = (status: string): PatientStatus => {
  return mapToPatientStatus(status);
};

/**
 * Gets the appropriate color class based on patient status
 */
export const getStatusColorClass = (status: PatientStatus): string => {
  switch (status) {
    case PatientStatus.Active:
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case PatientStatus.Discharged:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    case PatientStatus.Inactive:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    case PatientStatus.Scheduled:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case PatientStatus.OnLeave:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case PatientStatus.Critical:
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case PatientStatus.Stable:
      return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400';
    case PatientStatus.Unknown:
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
  }
};

/**
 * Gets a display label for the status
 */
export const getStatusLabel = (status: PatientStatus, language = 'en'): string => {
  if (language === 'pt') {
    switch (status) {
      case PatientStatus.Active:
        return 'Ativo';
      case PatientStatus.Discharged:
        return 'Alta';
      case PatientStatus.Inactive:
        return 'Inativo';
      case PatientStatus.Scheduled:
        return 'Agendado';
      case PatientStatus.OnLeave:
        return 'Em Licença';
      case PatientStatus.Critical:
        return 'Crítico';
      case PatientStatus.Stable:
        return 'Estável';
      case PatientStatus.Unknown:
      default:
        return 'Desconhecido';
    }
  }

  // English labels
  switch (status) {
    case PatientStatus.Active:
      return 'Active';
    case PatientStatus.Discharged:
      return 'Discharged';
    case PatientStatus.Inactive:
      return 'Inactive';
    case PatientStatus.Scheduled:
      return 'Scheduled';
    case PatientStatus.OnLeave:
      return 'On Leave';
    case PatientStatus.Critical:
      return 'Critical';
    case PatientStatus.Stable:
      return 'Stable';
    case PatientStatus.Unknown:
    default:
      return 'Unknown';
  }
};
