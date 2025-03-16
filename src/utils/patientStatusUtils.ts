
import { PatientStatus } from '@/types/patientTypes';

// Get status text for display
export const getStatusText = (status: PatientStatus): string => {
  switch (status) {
    case PatientStatus.ACTIVE:
      return 'Active';
    case PatientStatus.DISCHARGED:
      return 'Discharged';
    case PatientStatus.INACTIVE:
      return 'Inactive';
    case PatientStatus.CRITICAL:
      return 'Critical';
    case PatientStatus.STABLE:
      return 'Stable';
    case PatientStatus.HOSPITAL:
      return 'In Hospital';
    case PatientStatus.HOME:
      return 'At Home';
    case PatientStatus.IMPROVING:
      return 'Improving';
    default:
      return 'Unknown';
  }
};

// Get status color for UI
export const getStatusColor = (status: PatientStatus): string => {
  switch (status) {
    case PatientStatus.ACTIVE:
      return 'green';
    case PatientStatus.DISCHARGED:
      return 'blue';
    case PatientStatus.INACTIVE:
      return 'gray';
    case PatientStatus.CRITICAL:
      return 'red';
    case PatientStatus.STABLE:
      return 'green';
    case PatientStatus.HOSPITAL:
      return 'purple';
    case PatientStatus.HOME:
      return 'blue';
    case PatientStatus.IMPROVING:
      return 'teal';
    default:
      return 'gray';
  }
};

// Get status badge variant
export const getStatusBadgeVariant = (status: PatientStatus): string => {
  switch (status) {
    case PatientStatus.ACTIVE:
      return 'success';
    case PatientStatus.DISCHARGED:
      return 'info';
    case PatientStatus.INACTIVE:
      return 'secondary';
    case PatientStatus.CRITICAL:
      return 'destructive';
    case PatientStatus.STABLE:
      return 'success';
    case PatientStatus.HOSPITAL:
      return 'purple';
    case PatientStatus.HOME:
      return 'info';
    case PatientStatus.IMPROVING:
      return 'teal';
    default:
      return 'secondary';
  }
};

// Get status icon name
export const getStatusIcon = (status: PatientStatus): string => {
  switch (status) {
    case PatientStatus.ACTIVE:
      return 'check-circle';
    case PatientStatus.DISCHARGED:
      return 'log-out';
    case PatientStatus.INACTIVE:
      return 'x-circle';
    case PatientStatus.CRITICAL:
      return 'alert-circle';
    case PatientStatus.STABLE:
      return 'heart';
    case PatientStatus.HOSPITAL:
      return 'building';
    case PatientStatus.HOME:
      return 'home';
    case PatientStatus.IMPROVING:
      return 'trending-up';
    default:
      return 'help-circle';
  }
};
