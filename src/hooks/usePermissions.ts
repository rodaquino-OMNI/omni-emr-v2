
import { useCallback, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { 
  hasPermission as checkPermission, 
  canAccessPatientData as checkPatientAccess,
  getUserPermissions as fetchPermissions,
  canPerformClinicalDocumentation,
  canPerformMedicationAction,
  canPerformAppointmentAction,
  canPerformClinicalAssessment,
  canPerformEmergencyCare,
  canPerformCareCoordination,
  canPerformTelemedicine,
  canManageFluidBalance,
  canPerformTriageAssessment,
  canDocumentMedicalDecisionMaking
} from '../utils/permissionUtils';

export const usePermissions = (user: User | null) => {
  // State to store user permissions
  const [permissions, setPermissions] = useState<string[]>([]);
  
  // Fetch permissions when user changes
  useEffect(() => {
    if (user) {
      // Get permissions and update state
      const getAndSetPermissions = async () => {
        const userPermissions = await fetchPermissions(user);
        setPermissions(userPermissions);
      };
      
      getAndSetPermissions();
    } else {
      setPermissions([]);
    }
  }, [user]);
  
  // Function to check if the current user has a specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    return checkPermission(user, permission);
  }, [user]);

  // Function to check if the current user can access a specific patient's data
  const canAccessPatientData = useCallback((patientId: string): boolean => {
    return checkPatientAccess(user, patientId);
  }, [user]);
  
  // Function to get all permissions for the current user
  const getAllPermissions = useCallback((): string[] => {
    return permissions;
  }, [permissions]);
  
  // Function to check clinical documentation permissions
  const checkClinicalDocPermission = useCallback((action: 'create' | 'modify' | 'finalize' | 'view'): boolean => {
    return canPerformClinicalDocumentation(user, action);
  }, [user]);
  
  // Function to check medication action permissions
  const checkMedicationPermission = useCallback((action: 'prescribe' | 'administer' | 'verify' | 'view'): boolean => {
    return canPerformMedicationAction(user, action);
  }, [user]);
  
  // Function to check appointment action permissions
  const checkAppointmentPermission = useCallback((action: 'schedule' | 'modify' | 'cancel' | 'view'): boolean => {
    return canPerformAppointmentAction(user, action);
  }, [user]);
  
  // New clinical workflow specific functions
  const checkClinicalAssessment = useCallback((action: 'initial' | 'ongoing'): boolean => {
    return canPerformClinicalAssessment(user, action);
  }, [user]);
  
  const checkEmergencyCare = useCallback((action: 'triage' | 'treatment'): boolean => {
    return canPerformEmergencyCare(user, action);
  }, [user]);
  
  const checkCareCoordination = useCallback((action: 'planning' | 'transition'): boolean => {
    return canPerformCareCoordination(user, action);
  }, [user]);
  
  const canConductTelemedicine = useCallback((): boolean => {
    return canPerformTelemedicine(user);
  }, [user]);
  
  const canManagePatientFluidBalance = useCallback((): boolean => {
    return canManageFluidBalance(user);
  }, [user]);
  
  const canPerformTriage = useCallback((): boolean => {
    return canPerformTriageAssessment(user);
  }, [user]);
  
  const canDocumentDecisionMaking = useCallback((): boolean => {
    return canDocumentMedicalDecisionMaking(user);
  }, [user]);
  
  // Function to get user role display name
  const getRoleDisplayName = useCallback((): string => {
    if (!user) return '';
    
    const roleDisplayNames: Record<string, string> = {
      'admin': 'Administrator',
      'doctor': 'Physician',
      'nurse': 'Nurse',
      'caregiver': 'Caregiver',
      'patient': 'Patient',
      'specialist': 'Specialist',
      'administrative': 'Administrative Staff',
      'pharmacist': 'Pharmacist',
      'lab_technician': 'Laboratory Technician',
      'radiology_technician': 'Radiology Technician',
      'system_administrator': 'System Administrator'
    };
    
    return roleDisplayNames[user.role] || user.role;
  }, [user]);

  return {
    hasPermission,
    canAccessPatientData,
    getAllPermissions,
    checkClinicalDocPermission,
    checkMedicationPermission,
    checkAppointmentPermission,
    checkClinicalAssessment,
    checkEmergencyCare,
    checkCareCoordination,
    canConductTelemedicine,
    canManagePatientFluidBalance,
    canPerformTriage,
    canDocumentDecisionMaking,
    getRoleDisplayName
  };
};
