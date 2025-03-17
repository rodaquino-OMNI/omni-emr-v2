
import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useSectorContext } from '@/hooks/useSectorContext';

interface RouteAccessOptions {
  requiredPermission?: string;
  requiredRoles?: string[];
  requireSector?: boolean;
  patientId?: string;
}

/**
 * Custom hook to check if user has access to a specific route based on various criteria
 */
export const useRoleBasedRouteAccess = (options: RouteAccessOptions = {}) => {
  const { requiredPermission, requiredRoles = [], requireSector = false, patientId } = options;
  const { user, hasPermission } = useAuth();
  const permissions = usePermissions(user);
  const { selectedSector } = useSectorContext();
  
  const accessStatus = useMemo(() => {
    // Not authenticated
    if (!user) {
      return {
        hasAccess: false,
        reason: 'not_authenticated',
        needsSector: false,
        needsPermission: false
      };
    }
    
    // Check if a specific sector is required
    if (requireSector && !selectedSector) {
      return {
        hasAccess: false,
        reason: 'needs_sector',
        needsSector: true,
        needsPermission: false
      };
    }
    
    // Check if user has required role
    const hasRole = requiredRoles.length === 0 || requiredRoles.includes(user.role);
    if (!hasRole) {
      return {
        hasAccess: false,
        reason: 'forbidden_role',
        needsSector: false,
        needsPermission: false
      };
    }
    
    // Check if user has required permission
    const hasPermissionAccess = !requiredPermission || hasPermission(requiredPermission);
    if (!hasPermissionAccess) {
      return {
        hasAccess: false,
        reason: 'forbidden_permission',
        needsSector: false,
        needsPermission: true
      };
    }
    
    // Check patient access if patientId is provided
    if (patientId && !permissions.canAccessPatientData(patientId)) {
      return {
        hasAccess: false,
        reason: 'forbidden_patient',
        needsSector: false,
        needsPermission: false
      };
    }
    
    // All checks passed
    return {
      hasAccess: true,
      reason: 'granted',
      needsSector: false,
      needsPermission: false
    };
  }, [user, selectedSector, requiredRoles, requiredPermission, patientId, hasPermission, permissions]);
  
  return accessStatus;
};

export default useRoleBasedRouteAccess;
