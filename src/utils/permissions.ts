
import { UserRole } from '../types/auth';

/**
 * Category-based permissions for improved organization
 */
export const permissionCategories = {
  clinical: 'Clinical activities and decisions',
  nursing: 'Nursing care and documentation',
  administrative: 'Administrative tasks',
  system: 'System administration',
  pharmacy: 'Pharmacy operations',
  laboratory: 'Laboratory functions',
  radiology: 'Radiology functions',
  patient: 'Patient self-service',
  shared: 'Shared functionality',
  access: 'Access control'
};

/**
 * Permissions shared by all authenticated users
 */
export const sharedPermissions: string[] = [
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

/**
 * Role-based permission assignments - used as fallback when database isn't available
 */
export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['all'], // Admins have all permissions
  
  system_administrator: ['all'], // System administrators have all permissions
  
  doctor: [
    // Clinical permissions
    'create_prescriptions', 'sign_prescriptions', 'place_medical_orders', 'create_diagnoses',
    'sign_medical_documents', 'create_treatment_plans', 'order_consultations', 
    'finalize_clinical_documentation', 'create_directives', 'access_medical_history', 
    'override_alerts', 'create_clinical_pathways', 'discuss_sensitive_results', 
    'order_blood_products', 'certify_medical_necessity', 'sign_medical_clearances',
    
    // Access permissions
    'view_patients', 'edit_patients', 'view_records', 'edit_records', 'view_medications',
    'prescribe_medications', 'view_schedule', 'schedule_appointments', 'view_messages',
    'telemedicine', 'manage_vitals', 'manage_fluid_balance', 'view_analytics', 'view_all_patients'
  ],
  
  nurse: [
    // Nursing permissions
    'administer_medications', 'document_fluid_balance', 'record_vital_signs', 'implement_care_plans',
    'document_wound_care', 'process_admissions_discharges', 'manage_iv_lines', 'collect_specimens',
    'document_patient_education', 'conduct_nursing_assessments', 'implement_orders', 
    'document_shift_handover', 'reconcile_medications', 'document_daily_care', 'perform_triage',
    
    // Access permissions
    'view_patients', 'edit_patients', 'view_medications', 'view_records', 'schedule_appointments',
    'view_schedule', 'manage_vitals', 'manage_fluid_balance', 'view_assigned_patients',
    'document_assessments', 'view_orders', 'create_clinical_notes'
  ],
  
  administrative: [
    // Administrative permissions
    'register_patients', 'update_demographics', 'verify_insurance', 'manage_appointments',
    'manage_billing_codes', 'scan_documents', 'manage_correspondence', 'process_referrals',
    'process_information_release', 'manage_check_in_out', 'manage_non_clinical_communication',
    'manage_wait_times', 'generate_forms', 'archive_records', 'schedule_facilities', 'collect_feedback',
    
    // Access permissions
    'view_patients', 'schedule_appointments', 'view_schedule', 'manage_demographic_info',
    'view_insurance_info', 'manage_billing_info'
  ],
  
  pharmacist: [
    // Pharmacy permissions
    'verify_medications', 'manage_pharmacy_inventory', 'check_medication_interactions',
    'document_dispensing', 'provide_pharmacy_consultations', 'document_iv_preparations',
    'evaluate_medication_use', 'manage_antibiotic_stewardship', 'document_medication_teaching',
    'manage_medication_protocols', 'verify_chemotherapy', 'manage_controlled_substances',
    'manage_formulary', 'manage_medication_alerts', 'provide_pharmacokinetic_services',
    
    // Access permissions
    'view_patients', 'view_medications', 'view_records', 'view_allergies', 'view_diagnoses'
  ],
  
  lab_technician: [
    // Laboratory permissions
    'process_lab_specimens', 'enter_lab_results', 'document_quality_control',
    'maintain_lab_equipment', 'document_specimen_rejection', 'manage_lab_workflow',
    'notify_critical_values', 'manage_lab_inventory', 'document_test_methodology',
    'manage_reference_ranges', 'track_lab_performance', 'manage_lab_schedule',
    'track_specimen_storage', 'document_lab_certifications', 'manage_point_of_care_testing',
    
    // Access permissions
    'view_patients', 'view_lab_orders', 'view_lab_results'
  ],
  
  radiology_technician: [
    // Radiology permissions
    'document_imaging_studies', 'assess_image_quality', 'document_radiation_dose',
    'document_patient_positioning', 'select_imaging_protocols', 'document_contrast_administration',
    'document_equipment_quality', 'document_patient_preparation', 'manage_imaging_schedule',
    'manage_imaging_inventory', 'provide_technical_notes', 'troubleshoot_image_acquisition',
    'manage_image_storage', 'manage_modality_worklist', 'implement_radiation_safety',
    
    // Access permissions
    'view_patients', 'view_imaging_orders', 'view_imaging_results'
  ],
  
  patient: [
    // Patient permissions
    'update_personal_demographics', 'request_appointments', 'send_secure_messages',
    'complete_questionnaires', 'request_medication_refills', 'view_own_records',
    'report_symptoms', 'track_health_goals', 'submit_consent_forms', 'report_patient_outcomes',
    'update_insurance_info', 'access_educational_materials', 'view_health_summary',
    'participate_in_telemedicine', 'upload_documents',
    
    // Access permissions
    'view_own_records', 'view_own_medications', 'view_own_appointments', 'view_own_vitals',
    'view_own_fluid_balance', 'schedule_own_appointments', 'message_care_team'
  ],
  
  specialist: [
    // Clinical permissions (subset of doctor)
    'view_specialty_patients', 'view_records', 'view_medications', 'prescribe_medications',
    'edit_records', 'telemedicine', 'view_schedule', 'create_treatment_plans',
    'order_specialty_tests', 'create_clinical_notes', 'sign_clinical_notes', 'create_orders', 'sign_orders'
  ],
  
  caregiver: [
    // Caregiver permissions
    'view_patients', 'view_medications', 'view_records', 'view_vitals', 'view_fluid_balance',
    'assist_patient_care', 'view_care_plans', 'document_assisted_care', 'view_appointments',
    'request_appointments', 'message_care_team'
  ]
};
