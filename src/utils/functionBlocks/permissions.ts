
import { FunctionBlock } from '../../types/functionBlocks';
import { UserRole } from '../../types/auth';

/**
 * Check if a user with the given role has access to a function block
 */
export const hasAccessToFunctionBlock = (
  functionBlocks: FunctionBlock[],
  functionId: string,
  userRole: UserRole
): boolean => {
  // Find the function block
  const block = functionBlocks.find(b => b.id === functionId);
  
  // If block doesn't exist or is inactive, access is denied
  if (!block || !block.isActive) return false;
  
  // Check if user role is allowed for this function block
  return block.availableForRoles.includes(userRole) || userRole === 'admin' || userRole === 'system_administrator';
};

/**
 * Get all active function blocks available for a user role
 */
export const getAvailableFunctionBlocks = (
  functionBlocks: FunctionBlock[],
  userRole: UserRole
): FunctionBlock[] => {
  // Admin and system administrator have access to all active blocks
  if (userRole === 'admin' || userRole === 'system_administrator') {
    return functionBlocks.filter(block => block.isActive);
  }
  
  // Filter blocks by user role and active status
  return functionBlocks.filter(block => 
    block.isActive && block.availableForRoles.includes(userRole)
  );
};

/**
 * Get all permissions from active function blocks for a user role
 */
export const getPermissionsFromFunctionBlocks = (
  functionBlocks: FunctionBlock[],
  userRole: UserRole
): string[] => {
  // Get all available function blocks for this role
  const availableBlocks = getAvailableFunctionBlocks(functionBlocks, userRole);
  
  // Extract and flatten all permissions from these blocks
  const permissions = availableBlocks.flatMap(block => block.permissions);
  
  // Return unique permissions
  return [...new Set(permissions)];
};
