
import { PatientStatus } from '@/types/patientTypes';

// Get status text for display
export const getStatusText = (status: PatientStatus): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'discharged':
      return 'Discharged';
    case 'inactive':
      return 'Inactive';
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

// Get status color for UI
export const getStatusColor = (status: PatientStatus): string => {
  switch (status) {
    case 'active':
      return 'green';
    case 'discharged':
      return 'blue';
    case 'inactive':
      return 'gray';
    case 'critical':
      return 'red';
    case 'stable':
      return 'green';
    case 'hospital':
      return 'purple';
    case 'home':
      return 'blue';
    case 'improving':
      return 'teal';
    default:
      return 'gray';
  }
};

// Get status badge variant
export const getStatusBadgeVariant = (status: PatientStatus): string => {
  switch (status) {
    case 'active':
      return 'success';
    case 'discharged':
      return 'info';
    case 'inactive':
      return 'secondary';
    case 'critical':
      return 'destructive';
    case 'stable':
      return 'success';
    case 'hospital':
      return 'purple';
    case 'home':
      return 'info';
    case 'improving':
      return 'teal';
    default:
      return 'secondary';
  }
};

// Get status icon name
export const getStatusIcon = (status: PatientStatus): string => {
  switch (status) {
    case 'active':
      return 'check-circle';
    case 'discharged':
      return 'log-out';
    case 'inactive':
      return 'x-circle';
    case 'critical':
      return 'alert-circle';
    case 'stable':
      return 'heart';
    case 'hospital':
      return 'building';
    case 'home':
      return 'home';
    case 'improving':
      return 'trending-up';
    default:
      return 'help-circle';
  }
};
