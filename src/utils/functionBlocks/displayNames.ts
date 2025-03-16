
/**
 * Convert a permission code to a human-readable display name
 */
export const getFunctionDisplayName = (permission: string): string => {
  // Split by colon and convert each part
  const parts = permission.split(':');
  
  // Convert first part to title case
  const resource = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  
  // Handle different actions
  if (parts.length === 1) {
    return resource;
  }
  
  const action = parts[1];
  const qualifier = parts.length > 2 ? ` (${parts.slice(2).join(' ')})` : '';
  
  // Map actions to more readable text
  const actionMap: Record<string, string> = {
    'read': 'View',
    'write': 'Edit',
    'delete': 'Delete',
    'view': 'View',
    'create': 'Create',
    'update': 'Update',
    'administer': 'Administer',
    'prescribe': 'Prescribe',
    'process': 'Process'
  };
  
  const readableAction = actionMap[action] || action.charAt(0).toUpperCase() + action.slice(1);
  
  return `${readableAction} ${resource}${qualifier}`;
};
