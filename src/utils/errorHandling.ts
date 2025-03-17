
import { toast } from '@/hooks/use-toast';

/**
 * Standard error handling for API and data fetching operations
 */
export function handleApiError(error: unknown, friendlyMessage: string): Error {
  console.error('API Error:', error);
  
  // Create standardized error object
  const errorObj = error instanceof Error ? error : new Error(
    typeof error === 'string' ? error : friendlyMessage
  );
  
  // Show toast notification for user
  toast({
    title: 'Error',
    description: friendlyMessage,
    variant: 'destructive'
  });
  
  return errorObj;
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Validate API response data
 */
export function validateApiResponse<T>(data: T | null): T {
  if (!data) {
    throw new Error('Data not found');
  }
  return data;
}
