
import { User, UserRole } from '@/types/auth';

// Check medication permissions
export const canPerformMedicationAction = (
  user: User | null,
  action: 'administer' | 'prescribe' | 'dispense' | 'view'
): boolean => {
  if (!user) return false;
  
  if (action === 'administer') {
    return ['doctor', 'nurse'].includes(user.role as UserRole);
  } else if (action === 'prescribe') {
    return ['doctor', 'specialist'].includes(user.role as UserRole);
  } else if (action === 'dispense') {
    return ['pharmacist'].includes(user.role as UserRole);
  } else if (action === 'view') {
    return ['doctor', 'nurse', 'pharmacist', 'specialist', 'administrative', 'system_administrator'].includes(user.role as UserRole);
  }
  
  return false;
};
