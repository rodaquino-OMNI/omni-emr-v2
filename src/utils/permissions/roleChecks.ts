
import { User } from '../../types/auth';
import { rolePermissions, sharedPermissions } from '../permissions';

// Function to check if a user has a specific permission
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  
  // All authenticated users have shared permissions
  if (sharedPermissions.includes(permission)) {
    return true;
  }
  
  // Admins and system administrators have all permissions
  if (user.role === 'admin' || user.role === 'system_administrator') {
    return true;
  }
  
  // Check if permissions array exists and contains the required permission
  if (user.permissions && Array.isArray(user.permissions)) {
    if (user.permissions.includes('all')) {
      return true;
    }
    return user.permissions.includes(permission);
  }
  
  // If permissions are undefined/null but we have a role, use the role permissions
  if (user.role && rolePermissions[user.role]) {
    return rolePermissions[user.role].includes(permission) || 
           rolePermissions[user.role].includes('all');
  }
  
  return false;
};

// Function to get all permissions for a user
export const getUserPermissions = async (user: User | null): Promise<string[]> => {
  if (!user) return [];
  
  try {
    // Start with shared permissions
    const basePermissions = [...sharedPermissions];
    
    // Add role-base permissions
    if (user.role && rolePermissions[user.role]) {
      basePermissions.push(...rolePermissions[user.role]);
    }
    
    // Add explicit permissions assigned to the user
    if (user.permissions && Array.isArray(user.permissions)) {
      basePermissions.push(...user.permissions);
    }
    
    // If user has 'all' permission, they have all defined permissions
    if (basePermissions.includes('all')) {
      // Combine all permissions from all roles
      const allPossiblePermissions = Object.values(rolePermissions).flat();
      return [...new Set([...basePermissions, ...allPossiblePermissions])];
    }
    
    // Return unique permissions
    return [...new Set(basePermissions)];
  } catch (e) {
    console.error('Error getting user permissions:', e);
    return [];
  }
};
