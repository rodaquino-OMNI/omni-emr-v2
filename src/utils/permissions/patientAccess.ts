
import { User, UserRole } from '@/types/auth';

// Check if user can access a patient's data
export const canAccessPatientData = (user: User | null, patientId: string): boolean => {
  if (!user) return false;
  
  // Admin and clinical roles can access all patient data
  if (['admin', 'doctor', 'nurse', 'specialist'].includes(user.role as UserRole)) return true;
  
  // Patients can only access their own data
  if (user.role === 'patient') return user.id === patientId;
  
  return false;
};
