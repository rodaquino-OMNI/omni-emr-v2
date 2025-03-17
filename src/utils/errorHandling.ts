
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Handle Supabase PostgrestError and display appropriate toast message
 */
export const handleDatabaseError = (error: PostgrestError | null | unknown): Error => {
  if (!error) return new Error('Unknown database error');
  
  // For PostgrestError from Supabase
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    
    console.error('Database error:', pgError);
    
    // Handle common error codes
    switch (pgError.code) {
      case '23505': // unique_violation
        toast.error('Record already exists', {
          description: 'A duplicate record was found. Please modify your data and try again.'
        });
        break;
        
      case '23503': // foreign_key_violation
        toast.error('Related record not found', {
          description: 'The referenced record does not exist or has been deleted.'
        });
        break;
        
      case '42P01': // undefined_table
        toast.error('System error', {
          description: 'The requested data table does not exist. Please contact support.'
        });
        break;
        
      case '42601': // syntax_error
      case '42702': // ambiguous_column
      case '42703': // undefined_column
        toast.error('Query error', {
          description: 'There was a problem with the database query. Please contact support.'
        });
        break;
        
      default:
        toast.error('Database error', {
          description: pgError.message || 'An unknown database error occurred.'
        });
    }
    
    return new Error(pgError.message || 'Database error');
  } else {
    // Generic error handling
    console.error('Application error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    toast.error('Error', {
      description: errorMessage
    });
    
    return new Error(errorMessage);
  }
};

/**
 * Format an error message for display
 */
export const formatErrorMessage = (error: Error | unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unknown error occurred';
};

/**
 * Handle API errors and return formatted Error object
 */
export const handleApiError = (error: unknown, defaultMessage: string = 'API operation failed'): Error => {
  console.error('API Error:', error);
  
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return new Error(String(error.message));
  }
  
  return new Error(defaultMessage);
};

/**
 * Handle transaction errors
 */
export const handleTransactionError = (error: unknown, transactionName: string): Error => {
  console.error(`Transaction error in ${transactionName}:`, error);
  
  const baseMessage = `Transaction "${transactionName}" failed: `;
  
  if (error instanceof Error) {
    return new Error(`${baseMessage}${error.message}`);
  }
  
  if (typeof error === 'string') {
    return new Error(`${baseMessage}${error}`);
  }
  
  return new Error(`${baseMessage}Unknown error`);
};
