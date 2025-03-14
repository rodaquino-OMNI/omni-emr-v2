import { UserRole } from '../../types/auth';

// Define all permission categories
export const permissionCategories = {
  // Clinical assessment and documentation
  clinical: [
    'create_clinical_notes',
    'edit_records',
    'finalize_clinical_documentation',
    'sign_clinical_notes',
    'perform_initial_assessment',
    'perform_ongoing_assessment',
    'document_medical_decision_making',
    'create_diagnoses',
    'update_problem_list',
    'document_clinical_findings',
    'create_treatment_plan'
  ],
  
  // Medication management
  medication: [
    'prescribe_medications',
    'administer_medications',
    'verify_medications',
    'medication_reconciliation',
    'check_medication_interactions',
    'document_medication_effectiveness',
    'document_adverse_reactions'
  ],
  
  // Diagnostic and laboratory
  diagnostic: [
    'order_diagnostic_tests',
    'create_order_sets',
    'specify_test_urgency',
    'document_results_context',
    'alert_critical_values',
    'view_critical_results',
    'manage_critical_results',
    'perform_laboratory_tests',
    'enter_test_results'
  ],
  
  // Patient care
  care: [
    'document_vital_signs',
    'document_fluid_balance',
    'manage_fluid_balance',
    'create_care_plan',
    'implement_care_plan',
    'manage_care_transitions',
    'document_nursing_interventions',
    'provide_patient_education'
  ],
  
  // Emergency care
  emergency: [
    'perform_triage',
    'assign_acuity_level',
    'perform_emergency_treatment',
    'order_emergent_diagnostics',
    'implement_emergency_protocols',
    'document_emergency_care'
  ],
  
  // Telemedicine
  telemedicine: [
    'telemedicine',
    'conduct_virtual_visit',
    'document_telemedicine_findings',
    'manage_remote_care'
  ],
  
  // Hospital workflows
  hospital: [
    'determine_discharge_readiness',
    'create_discharge_orders',
    'complete_discharge_summary',
    'perform_admission_assessment',
    'document_inpatient_care',
    'coordinate_home_care'
  ],
  
  // Access controls
  access: [
    'view_patients',
    'edit_patients',
    'view_records',
    'edit_records',
    'view_medications',
    'view_own_medications',
    'view_lab_orders',
    'view_lab_results',
    'view_imaging_orders',
    'view_imaging_results',
    'view_schedule',
    'view_own_appointments',
    'view_messages',
    'view_vitals',
    'view_own_vitals',
    'view_fluid_balance',
    'view_own_fluid_balance',
    'view_all_patients',
    'view_assigned_patients',
    'view_specialty_patients',
    'view_analytics',
    'view_orders',
    'view_allergies',
    'view_diagnoses',
    'view_care_plans',
    'view_appointments',
    'view_own_records'
  ],
  
  // Actions
  actions: [
    'create_orders',
    'sign_orders',
    'schedule_appointments',
    'schedule_own_appointments',
    'request_appointments',
    'manage_appointments',
    'document_assessments',
    'document_assisted_care',
    'order_specialty_tests',
    'assist_patient_care',
    'message_care_team',
    'triage_patient_messages',
    'respond_clinical_messages',
    'approve_refill_requests'
  ],
  
  // Patient portal
  portal: [
    'upload_home_monitoring',
    'report_symptoms',
    'request_medication_refills',
    'complete_questionnaires',
    'update_personal_demographics'
  ],
  
  // Administrative
  administrative: [
    'manage_demographic_info',
    'view_insurance_info',
    'manage_billing_info',
    'register_patients',
    'verify_insurance',
    'process_referrals'
  ]
};

// Flatten all permissions for easier lookup
export const allPermissions = Object.values(permissionCategories).flat();

// Shared permissions that all authenticated users have
export const sharedPermissions = [
  'system_login',
  'manage_password',
  'view_notifications',
  'navigate_system',
  'manage_profile',
  'set_language_preference',
  'access_help',
  'adjust_accessibility',
  'manage_session_timeout',
  'basic_search',
  'view_announcements',
  'report_errors',
  'view_tasks',
  'basic_messaging',
  'check_system_status'
];
