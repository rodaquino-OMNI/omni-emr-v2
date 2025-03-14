
import { toast as sonnerToast } from "sonner";
import type { ToastT, ExternalToast } from "sonner";

export type ToastOptions = ExternalToast & {
  description?: string;
  duration?: number;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  className?: string;
  variant?: 'default' | 'destructive';
  title?: string;
};

// Create a specific type for the toast function to avoid type errors
type ToastFunction = {
  success: (message: string, options?: ToastOptions) => ToastT;
  error: (message: string, options?: ToastOptions) => ToastT;
  warning: (message: string, options?: ToastOptions) => ToastT;
  info: (message: string, options?: ToastOptions) => ToastT;
  default: (message: string, options?: ToastOptions) => ToastT;
  
  (message: string, options?: ToastOptions): ToastT;
  
  // Common scenario methods
  saved: () => ToastT;
  deleted: () => ToastT;
  updated: () => ToastT;
  created: () => ToastT;
  loginSuccess: () => ToastT;
  logoutSuccess: () => ToastT;
  permissionDenied: () => ToastT;
  networkError: () => ToastT;
  sessionExpired: () => ToastT;
  validationError: () => ToastT;
  
  // For shadcn/ui compatibility
  toast: typeof sonnerToast;
  toasts: any[];
};

// Create the toast object with function properties
export const toast: ToastFunction = Object.assign(
  // Base function
  (message: string, options?: ToastOptions): ToastT => sonnerToast(message, options) as ToastT,
  // Methods
  {
    success: (message: string, options?: ToastOptions): ToastT => sonnerToast.success(message, options) as ToastT,
    error: (message: string, options?: ToastOptions): ToastT => sonnerToast.error(message, options) as ToastT,
    warning: (message: string, options?: ToastOptions): ToastT => sonnerToast.warning(message, options) as ToastT,
    info: (message: string, options?: ToastOptions): ToastT => sonnerToast.info(message, options) as ToastT,
    default: (message: string, options?: ToastOptions): ToastT => sonnerToast(message, options) as ToastT,
    
    // Common scenarios with pre-defined messages
    saved: (): ToastT => sonnerToast.success('Successfully saved') as ToastT,
    deleted: (): ToastT => sonnerToast.success('Successfully deleted') as ToastT,
    updated: (): ToastT => sonnerToast.success('Successfully updated') as ToastT,
    created: (): ToastT => sonnerToast.success('Successfully created') as ToastT,
    loginSuccess: (): ToastT => sonnerToast.success('Successfully logged in') as ToastT,
    logoutSuccess: (): ToastT => sonnerToast.success('Successfully logged out') as ToastT,
    permissionDenied: (): ToastT => sonnerToast.error('Permission denied', { 
      description: 'You do not have permission to perform this action'
    }) as ToastT,
    networkError: (): ToastT => sonnerToast.error('Network error', { 
      description: 'Please check your connection and try again'
    }) as ToastT,
    sessionExpired: (): ToastT => sonnerToast.error('Session expired', { 
      description: 'Please log in again'
    }) as ToastT,
    validationError: (): ToastT => sonnerToast.error('Validation error', { 
      description: 'Please check the fields and try again'
    }) as ToastT,
    
    // Add for compatibility with shadcn/ui toast
    toast: sonnerToast,
    toasts: [] // Add empty array for shadcn compatibility
  }
);

export const useToast = () => {
  return { toast };
};
