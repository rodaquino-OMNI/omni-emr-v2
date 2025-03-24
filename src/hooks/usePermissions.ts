import { User } from '../types/auth';
import { supabase } from '../integrations/supabase/client';
import { PERMISSIONS } from '../constants/permissions';

// Helper function to get role display name
const getRoleDisplayName = (role?: string) => {
  const roleMap: Record<string, string> = {
    'doctor': 'Physician',
    'nurse': 'Nurse',
    'admin': 'Administrator',
    'patient': 'Patient',
    'specialist': 'Specialist',
    'pharmacist': 'Pharmacist',
    'lab_technician': 'Lab Technician',
    'administrative': 'Administrative Staff',
    'system_administrator': 'System Administrator',
    'caregiver': 'Caregiver',
    'radiology_technician': 'Radiology Technician'
  };

  return role ? (roleMap[role] || role) : 'Guest';
};

// Define permission checking functionality
export const usePermissions = (user: User | null | undefined) => {
    // Check if user has a specific permission
  async function hasPermission (permission: string): Promise<boolean> {
    if (!user?.id) return false;

    const { data, error } = await supabase.rpc('user_has_permission', {
        p_user_id: user.id,
        p_permission_code: permission
    });

    if(error) {
        console.error("Error checking permission:", error);
        return false;
    }

    return !!data;
  }

  return {
    hasPermission,
    // Check if user can access a patient's data
    canAccessPatientData: async (patientId: string): Promise<boolean> => {
      if (!user) return false;
      return (
        await hasPermission(PERMISSIONS.PATIENT_DATA_VIEW) ||
        (user.role === 'patient' && user.id === patientId)
      );
    },

    // Get display name for role
    getRoleDisplayName: (): string => {
      return getRoleDisplayName(user?.role);
    },

    // Check if user can perform triage
    canPerformTriage: async (): Promise<boolean> => {
      if (!user) return false;
      return await hasPermission(PERMISSIONS.TRIAGE_PERFORM);
    },

    // Check if user can access emergency care functions
    checkEmergencyCare: async (
      action: 'triage' | 'treatment' | 'view'
    ): Promise<boolean> => {
      if (!user) return false;
      if (action === 'triage') {
        return await hasPermission(PERMISSIONS.EMERGENCY_TRIAGE);
      } else if (action === 'treatment') {
        return await hasPermission(PERMISSIONS.EMERGENCY_TREAT);
      } else if (action === 'view') {
        return await hasPermission(PERMISSIONS.EMERGENCY_VIEW);
      }
      return false;
    },

    // Check medication permissions
    checkMedicationPermission: async (
      action: 'administer' | 'prescribe' | 'dispense' | 'view'
    ): Promise<boolean> => {
      if (!user) return false;
      if (action === 'administer') {
        return await hasPermission(PERMISSIONS.MEDICATIONS_ADMINISTER);
      } else if (action === 'prescribe') {
        return await hasPermission(PERMISSIONS.MEDICATIONS_PRESCRIBE);
      } else if (action === 'dispense') {
        return await hasPermission(PERMISSIONS.MEDICATIONS_DISPENSE);
      } else if (action === 'view') {
        return await hasPermission(PERMISSIONS.MEDICATIONS_VIEW);
      }
      return false;
    },

    // NEW: Check if user can access a specific sector
    canAccessSector: async (sectorId: string): Promise<boolean> => {
      if (!user) return false;

      // Admin has access to all sectors
      if (user.role === 'admin' || user.role === 'system_administrator')
        return true;

      // For other roles, we would check against the user_sector_access table
      // This is managed by Supabase RLS and the get_user_sectors function on the database.
      // We assume the backend handles this.  This is a potential issue as the frontend
      // does not accurately reflect sector access restrictions for non-admin users.
      return true;
    },

    // NEW: Check if user can perform actions on a patient in a specific sector
    canPerformActionInSector: async (
      action: 'view' | 'update' | 'triage' | 'discharge' | 'assign',
      sectorId: string
    ): Promise<boolean> => {
      if (!user) return false;

      // Admin can do all actions in all sectors - No need to check again inside hasPermission
      // if (user.role === 'admin' || user.role === 'system_administrator') return true;

      let permission = '';
      if (action === 'view') {
        permission = PERMISSIONS.SECTOR_VIEW;
      } else if (action === 'update') {
        permission = PERMISSIONS.SECTOR_UPDATE;
      } else if (action === 'triage') {
        permission = PERMISSIONS.SECTOR_TRIAGE;
      } else if (action === 'discharge') {
        permission = PERMISSIONS.SECTOR_DISCHARGE;
      } else if (action === 'assign') {
        permission = PERMISSIONS.SECTOR_ASSIGN;
      }
      return await hasPermission(permission);
    },

    // NEW: Get role-specific dashboard configuration
    getRoleDashboard: () => {
      if (!user) return 'default';

      // Return different dashboard configurations based on role
      if (user.role === 'doctor') {
        return 'physician';
      } else if (user.role === 'nurse') {
        return 'nurse';
      } else if (user.role === 'administrative') {
        return 'administrative';
      } else if (user.role === 'pharmacist') {
        return 'pharmacist';
      }

      return 'default';
    },
  };
}
