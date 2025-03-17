
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

/**
 * Specialized error handling for Supabase database operations
 */
export function handleDatabaseError(error: unknown, operation: string, entity: string): Error {
  console.error(`Database Error (${operation} ${entity}):`, error);
  
  // Detect specific Supabase error types
  const supabaseError = error as { code?: string; message?: string };
  
  // Create more specific error messages based on common Supabase error codes
  let errorMessage = `Failed to ${operation} ${entity}`;
  let friendlyMessage = `There was a problem with the ${entity.toLowerCase()} data`;
  
  // Check for common Supabase error codes
  if (supabaseError?.code) {
    switch (supabaseError.code) {
      case '23505': // Unique violation
        errorMessage = `A ${entity.toLowerCase()} with this identifier already exists`;
        friendlyMessage = `This ${entity.toLowerCase()} already exists in the system`;
        break;
      case '23503': // Foreign key violation
        errorMessage = `Referenced ${entity.toLowerCase()} doesn't exist`;
        friendlyMessage = `The ${entity.toLowerCase()} references data that doesn't exist`;
        break;
      case '42P01': // Undefined table
        errorMessage = `Database table not found`;
        friendlyMessage = `System configuration error`;
        break;
      case '42703': // Undefined column
        errorMessage = `Database column not found`;
        friendlyMessage = `System configuration error`;
        break;
      case '28P01': // Connection error
        errorMessage = `Database authentication error`;
        friendlyMessage = `Unable to connect to the database`;
        break;
      case '23502': // Not null violation
        errorMessage = `Missing required fields`;
        friendlyMessage = `Please fill out all required fields`;
        break;
    }
  }
  
  const errorObj = new Error(errorMessage);
  
  // Show toast notification for user
  toast({
    title: 'Database Error',
    description: friendlyMessage,
    variant: 'destructive'
  });
  
  return errorObj;
}

/**
 * Handle transaction errors with proper rollback support
 */
export function handleTransactionError(error: unknown, operation: string): Error {
  console.error(`Transaction Error (${operation}):`, error);
  
  const errorObj = error instanceof Error ? error : new Error(
    typeof error === 'string' ? error : `Failed to complete ${operation}`
  );
  
  // Show specific toast for transaction errors
  toast({
    title: 'Operation Failed',
    description: `The ${operation} couldn't be completed. No changes were made.`,
    variant: 'destructive'
  });
  
  return errorObj;
}

