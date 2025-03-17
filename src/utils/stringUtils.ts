
/**
 * Get initials from a name (e.g. "John Doe" => "JD")
 */
export const getInitials = (name: string = ''): string => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};
