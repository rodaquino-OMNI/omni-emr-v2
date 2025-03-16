
import { toast } from 'sonner';
import { logAuditEvent } from '@/integrations/supabase/audit';

interface ErrorOptions {
  entityId?: string;
  userId?: string;
  patientId?: string;
  operation: string;
  entityType: string;
  details?: Record<string, any>;
  showToast?: boolean;
}

/**
 * Standard error handler for service operations
 * Handles logging, toast notifications, and provides consistent error response
 */
export const handleServiceError = async <T>(
  error: any,
  options: ErrorOptions,
  fallbackFn?: () => T | Promise<T>
): Promise<{ success: false; error: Error; data?: T }> => {
  // Log the error to console
  console.error(`Error ${options.operation} ${options.entityType}:`, error);
  
  // Show a toast notification if requested
  if (options.showToast) {
    toast.error(`Error ${options.operation} ${options.entityType}`, { 
      description: error?.message || 'An unexpected error occurred'
    });
  }
  
  // Log an audit event if we have a user ID
  if (options.userId && options.entityType) {
    try {
      // Don't await, let it run in the background
      logAuditEvent(
        options.userId,
        `${options.operation}_error`,
        options.entityType,
        options.entityId || 'unknown',
        { 
          error: error?.message || 'Unknown error',
          patientId: options.patientId,
          ...options.details
        }
      );
    } catch (logError) {
      console.error('Error logging audit event:', logError);
    }
  }
  
  // Execute fallback function if provided
  let fallbackData: T | undefined;
  if (fallbackFn) {
    try {
      fallbackData = await fallbackFn();
    } catch (fallbackError) {
      console.error('Error in fallback function:', fallbackError);
    }
  }
  
  // Return standardized error response
  return {
    success: false,
    error: error instanceof Error ? error : new Error(error?.message || 'Unknown error'),
    data: fallbackData
  };
};

/**
 * Standard success handler for service operations
 * Handles logging, toast notifications, and provides consistent success response
 */
export const handleServiceSuccess = async <T>(
  data: T,
  options: Omit<ErrorOptions, 'showToast'> & { 
    showToast?: boolean;
    toastMessage?: string;
  }
): Promise<{ success: true; data: T }> => {
  // Show a toast notification if requested
  if (options.showToast) {
    toast.success(options.toastMessage || `${options.operation} successful`, {
      description: `The ${options.entityType} was successfully ${options.operation}d`
    });
  }
  
  // Log an audit event if we have a user ID
  if (options.userId && options.entityType && options.entityId) {
    try {
      // Don't await, let it run in the background
      logAuditEvent(
        options.userId,
        options.operation,
        options.entityType,
        options.entityId,
        { 
          patientId: options.patientId,
          ...options.details
        }
      );
    } catch (logError) {
      console.error('Error logging audit event:', logError);
    }
  }
  
  // Return standardized success response
  return {
    success: true,
    data
  };
};
