
import { format, isValid, parseISO, formatDistanceToNow } from 'date-fns';

/**
 * Format a date string or Date object to a readable format
 * 
 * @param dateString Date string or Date object to format
 * @param formatString Optional format string for date-fns
 * @returns Formatted date string or "Invalid Date" if the date is invalid
 */
export const formatDate = (dateString?: string | Date | null, formatString: string = 'MMM dd, yyyy HH:mm'): string => {
  if (!dateString) return 'Not recorded';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    if (!isValid(date)) {
      return 'Invalid Date';
    }
    
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format a date string or Date object to a short date format (MMM d, yyyy)
 */
export const formatShortDate = (dateString?: string | Date | null): string => {
  return formatDate(dateString, 'MMM d, yyyy');
};

/**
 * Format a date string or Date object to show only time (HH:mm)
 */
export const formatTime = (dateString?: string | Date | null): string => {
  return formatDate(dateString, 'HH:mm');
};

/**
 * Format a date as a relative time (e.g. "5 minutes ago")
 */
export const formatRelativeTime = (date: Date | string): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return 'Invalid date';
    }
    
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
};
