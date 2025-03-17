
import { RouteObject } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { authRoutes } from './authRoutes';
import { protectedRoutes } from './protectedRoutes';
import { translationRoutes } from './translationRoutes';
import { User } from '@/types/auth';
import { hasPermission } from '@/utils/permissionUtils';

// Combine all routes
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
  ...translationRoutes
];

/**
 * Creates dynamic routes based on user role and permissions
 * This allows for fine-grained control over what routes each user can access
 */
export const createDynamicRoutes = (role: string, permissions: string[]): RouteObject[] => {
  // Start with public and auth routes that everyone should have access to
  const dynamicRoutes = [...publicRoutes, ...authRoutes];
  
  // Create a mock user for permission checks
  const mockUser: User = {
    id: '',
    email: '',
    name: '',
    role: role as any,
    permissions: permissions
  };
  
  // Process protected routes - filter based on the user's role and permissions
  const filteredProtectedRoutes = protectedRoutes.map(route => {
    // If the route has metadata with permission requirements
    if (route.handle && (route.handle as any).requiredPermission) {
      const requiredPermission = (route.handle as any).requiredPermission;
      const requiredRole = (route.handle as any).requiredRole;
      
      // Check if the user has the required permission and role
      const hasPermissionAccess = hasPermission(mockUser, requiredPermission);
      const hasRoleAccess = !requiredRole || mockUser.role === requiredRole;
      
      // If the user doesn't have access, provide a redirect to the unauthorized page
      if (!hasPermissionAccess || !hasRoleAccess) {
        // Clone the route to avoid mutating the original
        const modifiedRoute = {...route};
        
        // If route.element is a React element with props
        if (modifiedRoute.element && typeof modifiedRoute.element === 'object' && 'props' in modifiedRoute.element) {
          // Add redirectTo prop
          const elementWithRedirect = {
            ...modifiedRoute.element,
            props: {
              ...(modifiedRoute.element.props || {}),
              redirectTo: '/unauthorized'
            }
          };
          
          modifiedRoute.element = elementWithRedirect;
        }
        
        return modifiedRoute;
      }
    }
    
    // Check if the route has children that need to be filtered
    if (route.children) {
      const filteredChildren = route.children.filter(childRoute => {
        if (childRoute.handle && (childRoute.handle as any).requiredPermission) {
          const childRequiredPermission = (childRoute.handle as any).requiredPermission;
          return hasPermission(mockUser, childRequiredPermission);
        }
        return true;
      });
      
      return {
        ...route,
        children: filteredChildren
      };
    }
    
    return route;
  });
  
  dynamicRoutes.push(...filteredProtectedRoutes);
  
  // Add translation routes for all users
  dynamicRoutes.push(...translationRoutes);
  
  return dynamicRoutes;
};
