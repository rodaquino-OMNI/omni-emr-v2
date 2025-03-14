
import { UserRole } from '../types/auth';

// Role-based permissions map
export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['all'],
  doctor: [
    'view_patients', 'edit_patients', 'prescribe_medications',
    'view_records', 'edit_records', 'schedule_appointments',
    'telemedicine', 'view_schedule', 'manage_vitals', 'manage_fluid_balance',
    'view_analytics', 'view_all_patients', 'create_treatment_plans',
    'order_lab_tests', 'view_clinical_decision_support'
  ],
  nurse: [
    'view_patients', 'edit_patients', 'view_medications',
    'view_records', 'schedule_appointments', 'view_schedule',
    'manage_vitals', 'manage_fluid_balance', 'administer_medications',
    'view_assigned_patients', 'execute_care_plans', 'document_assessments'
  ],
  caregiver: [
    'view_patients', 'view_medications', 'view_records',
    'view_vitals', 'view_fluid_balance', 'assist_patient_care'
  ],
  patient: [
    'view_own_records', 'view_own_medications', 'view_own_appointments',
    'view_own_vitals', 'view_own_fluid_balance', 'schedule_own_appointments',
    'message_care_team'
  ],
  specialist: [
    'view_patients', 'view_records', 'view_medications',
    'view_vitals', 'view_fluid_balance', 'view_schedule',
    'prescribe_medications', 'edit_records', 'telemedicine',
    'view_specialty_patients', 'order_specialty_tests'
  ],
  administrative: [
    'view_patients', 'schedule_appointments', 'view_schedule',
    'register_patients', 'manage_demographic_info', 'view_insurance_info',
    'manage_billing_info'
  ]
};
