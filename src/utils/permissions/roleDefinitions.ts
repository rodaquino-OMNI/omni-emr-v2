
import { UserRole } from '@/types/auth';

// Map of role permissions
export const rolePermissions: Record<UserRole, string[]> = {
  'admin': ['all'],
  'system_administrator': ['all'],
  'doctor': [
    'patients:read', 
    'patients:write', 
    'medications:read', 
    'medications:write',
    'vitals:read',
    'vitals:write',
    'diagnoses:read',
    'diagnoses:write',
    'prescriptions:read',
    'prescriptions:write'
  ],
  'physician': [
    'patients:read', 
    'patients:write', 
    'medications:read', 
    'medications:write',
    'vitals:read',
    'vitals:write',
    'diagnoses:read',
    'diagnoses:write',
    'prescriptions:read',
    'prescriptions:write'
  ],
  'nurse': [
    'patients:read',
    'vitals:read',
    'vitals:write',
    'medications:read',
    'medications:administer'
  ],
  'pharmacist': [
    'patients:read',
    'medications:read',
    'medications:write',
    'prescriptions:read',
    'prescriptions:process'
  ],
  'lab_technician': [
    'patients:read',
    'lab_results:read',
    'lab_results:write'
  ],
  'radiologist': [
    'patients:read',
    'imaging:read',
    'imaging:write'
  ],
  'therapist': [
    'patients:read',
    'treatment_plans:read',
    'treatment_plans:write',
    'progress_notes:read',
    'progress_notes:write'
  ],
  'patient': [
    'self:read',
    'appointments:read'
  ],
  'receptionist': [
    'patients:read',
    'appointments:read',
    'appointments:write'
  ],
  'medical_assistant': [
    'patients:read',
    'vitals:read',
    'vitals:write'
  ],
  'insurance_staff': [
    'billing:read',
    'billing:write',
    'insurance:read',
    'insurance:write'
  ],
  'researcher': [
    'anonymized_data:read'
  ],
  'coordinator': [
    'patients:read',
    'appointments:read',
    'appointments:write',
    'care_plans:read'
  ],
  'student': [
    'patients:read:supervised'
  ],
  'guest': [],
  'specialist': [
    'patients:read',
    'patients:write:specialty',
    'medications:read',
    'prescriptions:read:specialty',
    'prescriptions:write:specialty'
  ],
  'administrative': [
    'patients:read',
    'appointments:read',
    'appointments:write',
    'billing:read',
    'billing:write'
  ],
  'caregiver': [
    'assigned_patients:read'
  ],
  'radiology_technician': [
    'patients:read',
    'imaging:read',
    'imaging:write:technical'
  ]
};
