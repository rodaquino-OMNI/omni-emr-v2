
import { useMemo } from 'react';
import { User } from '../types/auth';

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
  return useMemo(() => ({
    // Check if user has a specific permission
    hasPermission: (permission: string): boolean => {
      if (!user || !user.permissions) return false;
      
      // Admin has all permissions
      if (user.role === 'admin' || user.role === 'system_administrator') return true;
      
      // Check if user has this specific permission or 'all' permissions
      return user.permissions.includes(permission) || user.permissions.includes('all');
    },
    
    // Check if user can access a patient's data
    canAccessPatientData: (patientId: string): boolean => {
      if (!user) return false;
      
      // Admin and clinical roles can access all patient data
      if (['admin', 'doctor', 'nurse', 'specialist'].includes(user.role)) return true;
      
      // Patients can only access their own data
      if (user.role === 'patient') return user.id === patientId;
      
      return false;
    },
    
    // Get display name for role
    getRoleDisplayName: (): string => {
      return getRoleDisplayName(user?.role);
    },
    
    // Check if user can perform triage
    canPerformTriage: (): boolean => {
      if (!user) return false;
      return ['doctor', 'nurse', 'administrative'].includes(user.role);
    },
    
    // Check if user can access emergency care functions
    checkEmergencyCare: (action: 'triage' | 'treatment' | 'view'): boolean => {
      if (!user) return false;
      
      if (action === 'triage') {
        return ['doctor', 'nurse', 'administrative'].includes(user.role);
      } else if (action === 'treatment') {
        return ['doctor', 'nurse'].includes(user.role);
      } else if (action === 'view') {
        return ['doctor', 'nurse', 'administrative', 'system_administrator'].includes(user.role);
      }
      
      return false;
    },

    // Check medication permissions
    checkMedicationPermission: (action: 'administer' | 'prescribe' | 'dispense' | 'view'): boolean => {
      if (!user) return false;
      
      if (action === 'administer') {
        return ['doctor', 'nurse'].includes(user.role);
      } else if (action === 'prescribe') {
        return ['doctor', 'specialist'].includes(user.role);
      } else if (action === 'dispense') {
        return ['pharmacist'].includes(user.role);
      } else if (action === 'view') {
        return ['doctor', 'nurse', 'pharmacist', 'specialist', 'administrative', 'system_administrator'].includes(user.role);
      }
      
      return false;
    },
    
    // NEW: Check if user can access a specific sector
    canAccessSector: (sectorId: string): boolean => {
      if (!user) return false;
      
      // Admin has access to all sectors
      if (user.role === 'admin' || user.role === 'system_administrator') return true;
      
      // For other roles, we would check against the user_sector_access table
      // This is managed by Supabase RLS and the get_user_sectors function
      return true; // Return true since this is checked at the DB level
    },
    
    // NEW: Check if user can perform actions on a patient in a specific sector
    canPerformActionInSector: (
      action: 'view' | 'update' | 'triage' | 'discharge' | 'assign', 
      sectorId: string
    ): boolean => {
      if (!user) return false;
      
      // Admin can do all actions in all sectors
      if (user.role === 'admin' || user.role === 'system_administrator') return true;
      
      // Different roles have different permissions per sector
      if (action === 'view') {
        return ['doctor', 'nurse', 'specialist', 'pharmacist', 'administrative'].includes(user.role);
      } else if (action === 'update') {
        return ['doctor', 'nurse'].includes(user.role);
      } else if (action === 'triage') {
        return ['doctor', 'nurse', 'administrative'].includes(user.role);
      } else if (action === 'discharge') {
        return ['doctor'].includes(user.role);
      } else if (action === 'assign') {
        return ['doctor', 'nurse', 'administrative'].includes(user.role);
      }
      
      return false;
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
    }
  }), [user]);
};
