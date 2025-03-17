
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { componentRegistry } from '@/registry/RoleComponentRegistry';
import { UserRole } from '@/types/auth';
import { 
  DoctorDashboard,
  NurseDashboard, 
  AdminDashboard, 
  PharmacistDashboard, 
  DefaultDashboard 
} from '@/registry/entrypoints';

/**
 * Hook to determine which dashboard component to display based on user role
 * Returns the appropriate dashboard component based on user role and permissions
 */
export const useRoleBasedDashboard = () => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  // Get the dashboard component based on user role
  const DashboardComponent = React.useMemo(() => {
    if (!user?.role) {
      // Default dashboard for users without a role
      return DefaultDashboard;
    }
    
    // Try to get a role-specific dashboard from the registry
    const registeredDashboard = componentRegistry.getComponent(
      'dashboard', 
      user.role as UserRole
    );
    
    if (registeredDashboard) {
      return registeredDashboard;
    }
    
    // Manual role mapping as a fallback
    switch (user.role) {
      case 'doctor':
      case 'physician':
        return DoctorDashboard;
      case 'nurse':
        return NurseDashboard;
      case 'admin':
      case 'system_administrator':
        return AdminDashboard;
      case 'pharmacist':
        return PharmacistDashboard;
      default:
        return DefaultDashboard;
    }
  }, [user]);
  
  /**
   * Get clinical documentation templates appropriate for the user's role
   */
  const getClinicalTemplates = React.useCallback(() => {
    if (!user?.role) return [];

    // Base set of templates available to all clinical roles
    const baseTemplates = [
      {
        id: 'progress',
        name: 'Progress Note',
        description: 'Daily progress documentation',
        category: 'Common Templates', 
        sections: ['Status', 'Interventions', 'Response', 'Plan'],
        isDefault: false
      }
    ];

    // Role-specific templates
    switch (user.role) {
      case 'doctor':
      case 'physician':
        return [
          {
            id: 'soap',
            name: 'SOAP Note',
            description: 'Standard SOAP format for visit documentation',
            category: 'Physician Templates',
            sections: ['Subjective', 'Objective', 'Assessment', 'Plan'],
            isDefault: true
          },
          {
            id: 'consultation',
            name: 'Consultation Note',
            description: 'Specialist consultation findings',
            category: 'Physician Templates',
            sections: ['Reason for Consultation', 'Findings', 'Impression', 'Recommendations']
          },
          {
            id: 'procedure',
            name: 'Procedure Note', 
            description: 'Detailed procedure documentation',
            category: 'Physician Templates',
            sections: ['Pre-procedure', 'Procedure Details', 'Findings', 'Post-procedure']
          },
          {
            id: 'discharge',
            name: 'Discharge Summary',
            description: 'Complete discharge documentation',
            category: 'Discharge',
            sections: ['Admission Summary', 'Hospital Course', 'Discharge Medications', 'Follow-up Instructions']
          },
          ...baseTemplates
        ];
      case 'nurse':
        return [
          {
            id: 'nursing_assessment',
            name: 'Nursing Assessment',
            description: 'Comprehensive nursing assessment',
            category: 'Nursing Templates',
            sections: ['General Assessment', 'Vital Signs', 'Interventions', 'Patient Response'],
            isDefault: true
          },
          {
            id: 'wound_care',
            name: 'Wound Care Note',
            description: 'Wound assessment and care documentation',
            category: 'Nursing Templates',
            sections: ['Wound Description', 'Treatment Performed', 'Patient Response', 'Plan']
          },
          {
            id: 'medication_admin',
            name: 'Medication Administration',
            description: 'Documentation of medication administration',
            category: 'Nursing Templates',
            sections: ['Medications Given', 'Time of Administration', 'Patient Response', 'Follow-up']
          },
          ...baseTemplates
        ];
      case 'pharmacist':
        return [
          {
            id: 'medication_review',
            name: 'Medication Review',
            description: 'Comprehensive medication review',
            category: 'Pharmacy Templates',
            sections: ['Current Medications', 'Interactions', 'Recommendations', 'Follow-up'],
            isDefault: true
          },
          {
            id: 'medication_reconciliation',
            name: 'Medication Reconciliation',
            description: 'Medication reconciliation at transitions of care',
            category: 'Pharmacy Templates',
            sections: ['Prior to Admission', 'During Visit', 'Discharge Medications', 'Discrepancies']
          },
          ...baseTemplates
        ];
      default:
        return baseTemplates;
    }
  }, [user]);
  
  return {
    DashboardComponent,
    userRole: user?.role || 'guest',
    hasPermission: permissions.hasPermission,
    getClinicalTemplates
  };
};
