
import { User } from '../../types/auth';
import { hasPermission } from './roleChecks';

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
