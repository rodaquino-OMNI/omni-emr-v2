
import { User } from '../types/auth';

export const usePermissions = (user: User | null) => {
  // Function to check if the current user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admins have all permissions
    if (user.role === 'admin' || user.permissions.includes('all')) {
      return true;
    }
    
    return user.permissions.includes(permission);
  };

  // Function to check if the current user can access a specific patient's data
  const canAccessPatientData = (patientId: string): boolean => {
    if (!user) return false;
    
    // Admins, doctors, and nurses can access all patient data
    if (user.role === 'admin' || user.role === 'doctor' || user.role === 'nurse') {
      return true;
    }
    
    // Patients can only access their own data
    if (user.role === 'patient') {
      return user.id === patientId;
    }
    
    // Caregivers would need a specific association with the patient
    // This would require a caregivers_patients table in a real application
    return false;
  };

  return {
    hasPermission,
    canAccessPatientData
  };
};
