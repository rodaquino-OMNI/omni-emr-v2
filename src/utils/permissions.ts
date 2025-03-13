
import { UserRole } from '../types/auth';

// Role-based permissions map
export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['all'],
  doctor: [
    'view_patients', 'edit_patients', 'prescribe_medications',
    'view_records', 'edit_records', 'schedule_appointments',
    'telemedicine', 'view_schedule'
  ],
  nurse: [
    'view_patients', 'edit_patients', 'view_medications',
    'view_records', 'schedule_appointments', 'view_schedule'
  ],
  caregiver: [
    'view_patients', 'view_medications', 'view_records'
  ],
  patient: [
    'view_own_records', 'view_own_medications', 'view_own_appointments'
  ]
};

