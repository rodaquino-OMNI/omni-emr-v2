
import { User } from '../types/auth';
import { rolePermissions } from '../utils/authUtils';

export const usePermissions = (user: User | null) => {
  // Function to check if the current user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admins have all permissions
    if (user.role === 'admin') {
      return true;
    }
    
    // Check if permissions array exists and contains the required permission
    if (user.permissions && Array.isArray(user.permissions)) {
      if (user.permissions.includes('all')) {
        return true;
      }
      return user.permissions.includes(permission);
    }
    
    // If permissions are undefined/null but we have a role, use the role permissions
    if (user.role && rolePermissions[user.role]) {
      return rolePermissions[user.role].includes(permission) || 
             rolePermissions[user.role].includes('all');
    }
    
    return false;
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
