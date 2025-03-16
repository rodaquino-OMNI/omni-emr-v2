
import { User, UserRole } from '@/types/auth';

// Check if user can perform appointment actions
export const canPerformAppointmentAction = (
  user: User | null,
  action: 'view' | 'schedule' | 'cancel' | 'reschedule'
): boolean => {
  if (!user) return false;
  
  if (action === 'view') {
    // All authenticated users can view their appointments
    return true;
  } else if (action === 'schedule' || action === 'cancel' || action === 'reschedule') {
    return ['doctor', 'nurse', 'administrative', 'receptionist'].includes(user.role as UserRole);
  }
  
  return false;
};
