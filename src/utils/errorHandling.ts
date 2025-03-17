
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * Handle Supabase PostgrestError and display appropriate toast message
 */
export const handleDatabaseError = (error: PostgrestError | null | unknown): void => {
  if (!error) return;
  
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
  } else {
    // Generic error handling
    console.error('Application error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    toast.error('Error', {
      description: errorMessage
    });
  }
};

/**
 * Handle form validation errors
 */
export const handleValidationErrors = (
  errors: Record<string, string> | null | undefined, 
  setValidationErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
): void => {
  if (errors && Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    
    // Show toast with first error
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error('Validation Error', {
        description: firstError
      });
    }
  }
};
