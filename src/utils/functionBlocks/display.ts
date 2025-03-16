
/**
 * Convert a function block ID to a display-friendly name
 */
export const getFunctionDisplayName = (id: string): string => {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
