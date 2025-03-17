
import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import { componentRegistry } from '@/registry/RoleComponentRegistry';

/**
 * Custom hook to get a component based on the current user's role
 */
export const useRoleBasedComponent = (
  componentType: string, 
  fallbackComponent: React.ComponentType<any> | null = null
) => {
  const { user } = useAuth();
  
  const roleName = user?.role as UserRole || 'guest';
  
  const Component = useMemo(() => {
    const registeredComponent = componentRegistry.getComponent(componentType, roleName);
    return registeredComponent || fallbackComponent;
  }, [componentType, roleName, fallbackComponent]);

  return {
    Component,
    userRole: roleName,
    hasComponent: !!Component
  };
};

export default useRoleBasedComponent;
