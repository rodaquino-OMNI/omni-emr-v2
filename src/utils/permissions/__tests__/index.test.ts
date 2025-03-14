
import { describe, it, expect } from 'vitest';
import * as permissionExports from '../index';

describe('Permissions module exports', () => {
  it('should export all necessary permission functions', () => {
    // Permission types
    expect(permissionExports.permissionCategories).toBeDefined();
    expect(permissionExports.sharedPermissions).toBeDefined();
    expect(permissionExports.rolePermissions).toBeDefined();
    expect(permissionExports.allPermissions).toBeDefined();
    
    // Role checks
    expect(permissionExports.hasPermission).toBeDefined();
    expect(permissionExports.getUserPermissions).toBeDefined();
    
    // Patient access
    expect(permissionExports.canAccessPatientData).toBeDefined();
    
    // Clinical documentation
    expect(permissionExports.canPerformClinicalDocumentation).toBeDefined();
    expect(permissionExports.canPerformClinicalAssessment).toBeDefined();
    expect(permissionExports.canDocumentMedicalDecisionMaking).toBeDefined();
    
    // Medication management
    expect(permissionExports.canPerformMedicationAction).toBeDefined();
    
    // Appointment management
    expect(permissionExports.canPerformAppointmentAction).toBeDefined();
    
    // Clinical workflows
    expect(permissionExports.canPerformEmergencyCare).toBeDefined();
    expect(permissionExports.canPerformCareCoordination).toBeDefined();
    expect(permissionExports.canPerformTelemedicine).toBeDefined();
    expect(permissionExports.canManageFluidBalance).toBeDefined();
    expect(permissionExports.canPerformTriageAssessment).toBeDefined();
  });
});
