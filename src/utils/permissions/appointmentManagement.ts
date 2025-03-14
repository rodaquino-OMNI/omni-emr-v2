
import { User } from '../../types/auth';
import { hasPermission } from './roleChecks';

// Check if user can perform specific appointment actions
export const canPerformAppointmentAction = (user: User | null, action: 'schedule' | 'modify' | 'cancel' | 'view'): boolean => {
  if (!user) return false;
  
  switch (action) {
    case 'schedule':
      return hasPermission(user, 'schedule_appointments') || 
             hasPermission(user, 'schedule_own_appointments') ||
             hasPermission(user, 'request_appointments');
    case 'modify':
    case 'cancel':
      return hasPermission(user, 'manage_appointments') || 
             (user.role === 'administrative');
    case 'view':
      return hasPermission(user, 'view_schedule') || 
             hasPermission(user, 'view_own_appointments');
    default:
      return false;
  }
};
