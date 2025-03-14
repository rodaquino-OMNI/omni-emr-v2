
import { User } from '../types/auth';
import { supabase } from '../integrations/supabase/client';
import { rolePermissions, sharedPermissions } from './permissions';

// Function to check if a user has a specific permission
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // All authenticated users have shared permissions
  if (sharedPermissions.includes(permission)) {
    return true;
  }
  
  // Admins and system administrators have all permissions
  if (user.role === 'admin' || user.role === 'system_administrator') {
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

// Function to check if a user can access a specific patient's data
export const canAccessPatientData = (user: User | null, patientId: string): boolean => {
  if (!user) return false;
  
  // Admins, system administrators have all access
  if (user.role === 'admin' || user.role === 'system_administrator') {
    return true;
  }
  
  // Clinical staff (doctors, nurses, etc.) can access patient data
  if (['doctor', 'nurse', 'specialist', 'pharmacist'].includes(user.role)) {
    return true;
  }
  
  // Administrative staff have limited access
  if (user.role === 'administrative') {
    // In a real application, this might check if this patient
    // is assigned to this administrative staff member
    return hasPermission(user, 'view_patients');
  }
  
  // Lab and radiology technicians can access patient data for their work
  if (['lab_technician', 'radiology_technician'].includes(user.role)) {
    // In a real application, this would check if there are orders
    // for this patient for this technician
    return hasPermission(user, 'view_patients');
  }
  
  // Patients can only access their own data
  if (user.role === 'patient') {
    return user.id === patientId;
  }
  
  // Caregivers need explicit association with the patient
  if (user.role === 'caregiver') {
    // In a real application, this would check a caregivers_patients table
    // to see if this caregiver is authorized for this patient
    return false;
  }
  
  return false;
};

// Function to get all permissions for a user
export const getUserPermissions = async (user: User | null): Promise<string[]> => {
  if (!user) return [];
  
  try {
    // Try to get permissions from the database using a custom query
    // instead of the RPC that was causing the error
    const { data, error } = await supabase
      .from('role_permissions')
      .select('permissions(name)')
      .eq('role', user.role);
    
    if (!error && data && data.length > 0) {
      // Extract permission names from the returned data
      const permissionNames = data.map(item => item.permissions?.name).filter(Boolean) as string[];
      return permissionNames;
    }
  } catch (e) {
    console.error('Error fetching permissions from database:', e);
    // Continue to fallback
  }
  
  // Fallback to local permission definitions
  const basePermissions = [...sharedPermissions];
  
  // Add role-based permissions
  if (user.role && rolePermissions[user.role]) {
    basePermissions.push(...rolePermissions[user.role]);
  }
  
  // Add explicit permissions assigned to the user
  if (user.permissions && Array.isArray(user.permissions)) {
    basePermissions.push(...user.permissions);
  }
  
  // If user has 'all' permission, they have all defined permissions
  if (basePermissions.includes('all')) {
    // Combine all permissions from all roles
    const allPossiblePermissions = Object.values(rolePermissions).flat();
    return [...new Set([...basePermissions, ...allPossiblePermissions])];
  }
  
  // Return unique permissions
  return [...new Set(basePermissions)];
};

// Check if user has permission for specific clinical documentation action
export const canPerformClinicalDocumentation = (user: User | null, action: 'create' | 'modify' | 'finalize' | 'view'): boolean => {
  if (!user) return false;
  
  switch (action) {
    case 'create':
      return hasPermission(user, 'create_clinical_notes');
    case 'modify':
      return hasPermission(user, 'edit_records');
    case 'finalize':
      return hasPermission(user, 'finalize_clinical_documentation');
    case 'view':
      return hasPermission(user, 'view_records') || 
             hasPermission(user, 'view_own_records');
    default:
      return false;
  }
};

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
