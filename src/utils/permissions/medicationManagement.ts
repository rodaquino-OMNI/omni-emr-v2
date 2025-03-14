
import { User } from '../../types/auth';
import { hasPermission } from './roleChecks';

// Check if user has permission for specific medication management action
export const canPerformMedicationAction = (user: User | null, action: 'prescribe' | 'administer' | 'verify' | 'view'): boolean => {
  if (!user) return false;
  
  switch (action) {
    case 'prescribe':
      return hasPermission(user, 'prescribe_medications');
    case 'administer':
      return hasPermission(user, 'administer_medications');
    case 'verify':
      return hasPermission(user, 'verify_medications');
    case 'view':
      return hasPermission(user, 'view_medications') || 
             hasPermission(user, 'view_own_medications');
    default:
      return false;
  }
};
