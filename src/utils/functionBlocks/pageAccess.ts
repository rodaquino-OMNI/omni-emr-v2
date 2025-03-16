
import { FunctionBlock, FunctionBlockMapping } from '../../types/functionBlocks';
import { UserRole } from '../../types/auth';
import { hasAccessToFunctionBlock } from './permissions';

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
  { pageRoute: '/critical-results', requiredFunction: 'critical_results' },
  // Add sectors page mapping - this is explicitly not restricted by function blocks
  { pageRoute: '/sectors', requiredFunction: '' }
];

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
  
  // If no mapping found or requiredFunction is empty, assume access is allowed
  if (!mapping || !mapping.requiredFunction) return true;
  
  // Check if user has access to the required function
  return hasAccessToFunctionBlock(functionBlocks, mapping.requiredFunction, userRole);
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

// Export page function mapping for use in other parts of the application
export { pageFunctionMapping };
