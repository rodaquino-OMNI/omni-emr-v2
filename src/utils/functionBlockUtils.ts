
import { FunctionBlock, FunctionBlockMapping } from '../types/functionBlocks';
import { UserRole } from '../types/auth';

// Map of page routes to their required function blocks
const pageFunctionMapping: FunctionBlockMapping[] = [
  { pageRoute: '/patients', requiredFunction: 'patient_management' },
  { pageRoute: '/patients/:id', requiredFunction: 'patient_management' },
  { pageRoute: '/medications', requiredFunction: 'medication_management' },
  { pageRoute: '/medication/:id', requiredFunction: 'medication_management' },
  { pageRoute: '/prescribe', requiredFunction: 'medication_management' },
  { pageRoute: '/records', requiredFunction: 'clinical_documentation' },
  { pageRoute: '/record/:id', requiredFunction: 'clinical_documentation' },
  { pageRoute: '/clinical-documentation', requiredFunction: 'clinical_documentation' },
  { pageRoute: '/schedule', requiredFunction: 'appointment_scheduling' },
  { pageRoute: '/appointments', requiredFunction: 'appointment_scheduling' },
  { pageRoute: '/emergency-care', requiredFunction: 'emergency_care' },
  { pageRoute: '/triage', requiredFunction: 'emergency_care' },
  { pageRoute: '/fluid-balance', requiredFunction: 'fluid_balance' },
  { pageRoute: '/vitals', requiredFunction: 'vital_signs' },
  { pageRoute: '/vital-signs', requiredFunction: 'vital_signs' },
  { pageRoute: '/messages', requiredFunction: 'messaging' },
  { pageRoute: '/telemedicine', requiredFunction: 'telemedicine' },
  { pageRoute: '/hospital-workflows', requiredFunction: 'hospital_workflow' },
  { pageRoute: '/tasks', requiredFunction: 'task_management' },
  { pageRoute: '/orders', requiredFunction: 'order_management' },
  { pageRoute: '/critical-results', requiredFunction: 'critical_results' }
];

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
 * Check if a user can access a specific page based on function blocks
 */
export const canAccessPage = (
  functionBlocks: FunctionBlock[],
  pageRoute: string,
  userRole: UserRole
): boolean => {
  // Admins can access all pages
  if (userRole === 'admin' || userRole === 'system_administrator') return true;
  
  // Find the mapping for this page
  const mapping = pageFunctionMapping.find(m => {
    // Handle dynamic routes with parameters (like /patients/:id)
    if (m.pageRoute.includes(':')) {
      const regex = new RegExp(
        '^' + m.pageRoute.replace(/:[^\s/]+/g, '[^/]+') + '$'
      );
      return regex.test(pageRoute);
    }
    return m.pageRoute === pageRoute;
  });
  
  // If no mapping found, assume access is allowed (no special function required)
  if (!mapping) return true;
  
  // Check if user has access to the required function
  return hasAccessToFunctionBlock(functionBlocks, mapping.requiredFunction, userRole);
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

/**
 * Get the fallback route for a page if access is denied
 */
export const getFallbackForPage = (pageRoute: string): string => {
  const mapping = pageFunctionMapping.find(m => {
    if (m.pageRoute.includes(':')) {
      const regex = new RegExp(
        '^' + m.pageRoute.replace(/:[^\s/]+/g, '[^/]+') + '$'
      );
      return regex.test(pageRoute);
    }
    return m.pageRoute === pageRoute;
  });
  
  return mapping?.fallbackRoute || '/unauthorized';
};

/**
 * Check for circular dependencies in function blocks
 */
export const checkForCircularDependencies = (
  functionBlocks: FunctionBlock[],
  blockId: string,
  visited: Set<string> = new Set(),
  recursionStack: Set<string> = new Set()
): boolean => {
  // Mark the current node as visited and part of recursion stack
  visited.add(blockId);
  recursionStack.add(blockId);
  
  // Get the current block
  const block = functionBlocks.find(b => b.id === blockId);
  
  // If block has dependencies, check each one
  if (block?.requiredDependencies) {
    for (const depId of block.requiredDependencies) {
      // If not visited, check for circular dependency
      if (!visited.has(depId)) {
        if (checkForCircularDependencies(functionBlocks, depId, visited, recursionStack)) {
          return true;
        }
      } 
      // If already in recursion stack, we found a cycle
      else if (recursionStack.has(depId)) {
        return true;
      }
    }
  }
  
  // Remove from recursion stack
  recursionStack.delete(blockId);
  return false;
};

/**
 * Get all dependent function blocks that need to be enabled
 * when enabling a specific function block
 */
export const getDependentFunctionBlocks = (
  functionBlocks: FunctionBlock[],
  blockId: string
): string[] => {
  const dependencies: string[] = [];
  const block = functionBlocks.find(b => b.id === blockId);
  
  if (!block?.requiredDependencies) return dependencies;
  
  // Add direct dependencies
  dependencies.push(...block.requiredDependencies);
  
  // Add indirect dependencies (dependencies of dependencies)
  for (const depId of block.requiredDependencies) {
    dependencies.push(...getDependentFunctionBlocks(functionBlocks, depId));
  }
  
  // Return unique dependencies
  return [...new Set(dependencies)];
};

/**
 * Convert a function block ID to a display-friendly name
 */
export const getFunctionDisplayName = (id: string): string => {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
