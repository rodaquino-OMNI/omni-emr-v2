/**
 * Workflow Analyzer for Orphaned Pages
 * 
 * This module provides functions for mapping pages to clinical workflows and user roles.
 */

// Clinical workflows
export const CLINICAL_WORKFLOWS = {
  PATIENT_MANAGEMENT: 'Patient Management',
  MEDICATION_MANAGEMENT: 'Medication Management',
  CLINICAL_DOCUMENTATION: 'Clinical Documentation',
  EMERGENCY_CARE: 'Emergency Care',
  ADMINISTRATIVE: 'Administrative Functions',
  SYSTEM_CONFIGURATION: 'System Configuration',
  AUTHENTICATION: 'Authentication',
  UTILITY: 'Utility Functions'
};

// User roles
export const USER_ROLES = {
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  ADMIN: 'admin',
  SYSTEM_ADMINISTRATOR: 'system_administrator',
  PHARMACIST: 'pharmacist',
  ADMINISTRATIVE: 'administrative'
};

/**
 * Map a page to a clinical workflow based on its name and functional analysis
 * @param {string} pageName - Name of the page component
 * @param {Object} functionalAnalysis - Results of functional analysis
 * @returns {string} - Clinical workflow
 */
export function mapToClinicaWorkflow(pageName, functionalAnalysis) {
  // Default mapping based on page name
  if (pageName.includes('Patient') || pageName === 'Patients') {
    return CLINICAL_WORKFLOWS.PATIENT_MANAGEMENT;
  } else if (pageName.includes('Medication') || pageName === 'Medications' || pageName.includes('Prescription')) {
    return CLINICAL_WORKFLOWS.MEDICATION_MANAGEMENT;
  } else if (pageName.includes('Documentation') || pageName.includes('Record') || pageName.includes('Note') || pageName === 'VisitNotes') {
    return CLINICAL_WORKFLOWS.CLINICAL_DOCUMENTATION;
  } else if (pageName.includes('Emergency')) {
    return CLINICAL_WORKFLOWS.EMERGENCY_CARE;
  } else if (pageName.includes('Admin') || pageName === 'RoleManagement' || pageName === 'FunctionBlocks') {
    return CLINICAL_WORKFLOWS.ADMINISTRATIVE;
  } else if (pageName === 'Login' || pageName === 'Register' || pageName === 'ResetPassword') {
    return CLINICAL_WORKFLOWS.AUTHENTICATION;
  } else if (pageName === 'Help' || pageName === 'NotFound' || pageName === 'PageNotFound') {
    return CLINICAL_WORKFLOWS.UTILITY;
  }

  // If no direct match, use functional analysis
  const functionality = functionalAnalysis.primaryFunctionality.toLowerCase();
  if (functionality.includes('patient')) {
    return CLINICAL_WORKFLOWS.PATIENT_MANAGEMENT;
  } else if (functionality.includes('medication')) {
    return CLINICAL_WORKFLOWS.MEDICATION_MANAGEMENT;
  } else if (functionality.includes('documentation') || functionality.includes('record')) {
    return CLINICAL_WORKFLOWS.CLINICAL_DOCUMENTATION;
  } else if (functionality.includes('emergency')) {
    return CLINICAL_WORKFLOWS.EMERGENCY_CARE;
  } else if (functionality.includes('admin')) {
    return CLINICAL_WORKFLOWS.ADMINISTRATIVE;
  } else if (functionality.includes('auth')) {
    return CLINICAL_WORKFLOWS.AUTHENTICATION;
  }

  // Default to utility if no match
  return CLINICAL_WORKFLOWS.UTILITY;
}

/**
 * Determine relevant user roles for a page based on its name and clinical workflow
 * @param {string} pageName - Name of the page component
 * @param {string} clinicalWorkflow - Clinical workflow
 * @returns {string[]} - Array of relevant user roles
 */
export function determineUserRoles(pageName, clinicalWorkflow) {
  const roles = [];

  // Add roles based on clinical workflow
  switch (clinicalWorkflow) {
    case CLINICAL_WORKFLOWS.PATIENT_MANAGEMENT:
      roles.push(USER_ROLES.DOCTOR, USER_ROLES.NURSE, USER_ROLES.ADMIN);
      break;
    case CLINICAL_WORKFLOWS.MEDICATION_MANAGEMENT:
      roles.push(USER_ROLES.DOCTOR, USER_ROLES.NURSE, USER_ROLES.PHARMACIST);
      break;
    case CLINICAL_WORKFLOWS.CLINICAL_DOCUMENTATION:
      roles.push(USER_ROLES.DOCTOR, USER_ROLES.NURSE);
      break;
    case CLINICAL_WORKFLOWS.EMERGENCY_CARE:
      roles.push(USER_ROLES.DOCTOR, USER_ROLES.NURSE);
      break;
    case CLINICAL_WORKFLOWS.ADMINISTRATIVE:
      roles.push(USER_ROLES.ADMIN, USER_ROLES.SYSTEM_ADMINISTRATOR);
      break;
    case CLINICAL_WORKFLOWS.SYSTEM_CONFIGURATION:
      roles.push(USER_ROLES.SYSTEM_ADMINISTRATOR);
      break;
    case CLINICAL_WORKFLOWS.AUTHENTICATION:
      // All roles need authentication
      roles.push(USER_ROLES.DOCTOR, USER_ROLES.NURSE, USER_ROLES.ADMIN, USER_ROLES.SYSTEM_ADMINISTRATOR, USER_ROLES.PHARMACIST, USER_ROLES.ADMINISTRATIVE);
      break;
    case CLINICAL_WORKFLOWS.UTILITY:
      // Utility pages are generally accessible to all roles
      roles.push(USER_ROLES.DOCTOR, USER_ROLES.NURSE, USER_ROLES.ADMIN, USER_ROLES.SYSTEM_ADMINISTRATOR, USER_ROLES.PHARMACIST, USER_ROLES.ADMINISTRATIVE);
      break;
  }

  // Add specific roles based on page name
  if (pageName.includes('Admin') || pageName === 'RoleManagement' || pageName === 'FunctionBlocks') {
    if (!roles.includes(USER_ROLES.ADMIN)) roles.push(USER_ROLES.ADMIN);
    if (!roles.includes(USER_ROLES.SYSTEM_ADMINISTRATOR)) roles.push(USER_ROLES.SYSTEM_ADMINISTRATOR);
  }

  return roles;
}

/**
 * Get a description of the workflow for a given clinical workflow
 * @param {string} clinicalWorkflow - Clinical workflow
 * @returns {string} - Workflow description
 */
export function getWorkflowDescription(clinicalWorkflow) {
  switch (clinicalWorkflow) {
    case CLINICAL_WORKFLOWS.PATIENT_MANAGEMENT:
      return "Managing patient information, demographics, and status";
    case CLINICAL_WORKFLOWS.MEDICATION_MANAGEMENT:
      return "Managing medications, prescriptions, and administration";
    case CLINICAL_WORKFLOWS.CLINICAL_DOCUMENTATION:
      return "Creating and managing clinical notes, records, and documentation";
    case CLINICAL_WORKFLOWS.EMERGENCY_CARE:
      return "Managing emergency care workflows and triage";
    case CLINICAL_WORKFLOWS.ADMINISTRATIVE:
      return "Administrative functions for system management";
    case CLINICAL_WORKFLOWS.SYSTEM_CONFIGURATION:
      return "System configuration and setup";
    case CLINICAL_WORKFLOWS.AUTHENTICATION:
      return "User authentication and account management";
    case CLINICAL_WORKFLOWS.UTILITY:
      return "Utility functions and support pages";
    default:
      return "Unknown workflow";
  }
}