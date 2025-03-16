
import { toast as sonnerToast } from "sonner";
import type { ToastT, ExternalToast } from "sonner";
import { ReactNode } from "react";

export type ToastProps = ExternalToast & {
  description?: string;
  duration?: number;
  action?: React.ReactNode;
  icon?: ReactNode;
  id?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'error';
  title?: string;
};

// Create a specific type for the toast function to avoid type errors
type ToastFunction = {
  success: (options: ToastProps | string) => ToastT;
  error: (options: ToastProps | string) => ToastT;
  warning: (options: ToastProps | string) => ToastT;
  info: (options: ToastProps | string) => ToastT;
  default: (options: ToastProps | string) => ToastT;
  
  (options: ToastProps | string): ToastT;
  
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

// Helper function to handle both string and object parameters
const handleToastParams = (options: ToastProps | string): [string | undefined, ExternalToast] => {
  if (typeof options === 'string') {
    return [options, {}];
  }
  const { title, ...rest } = options;
  return [title, rest];
};

// Create the toast object with function properties
export const toast: ToastFunction = Object.assign(
  // Base function
  (options: ToastProps | string): ToastT => {
    const [title, rest] = handleToastParams(options);
    return sonnerToast(title || '', rest) as unknown as ToastT;
  },
  // Methods
  {
    success: (options: ToastProps | string): ToastT => {
      const [title, rest] = handleToastParams(options);
      return sonnerToast.success(title || '', rest) as unknown as ToastT;
    },
    error: (options: ToastProps | string): ToastT => {
      const [title, rest] = handleToastParams(options);
      return sonnerToast.error(title || '', rest) as unknown as ToastT;
    },
    warning: (options: ToastProps | string): ToastT => {
      const [title, rest] = handleToastParams(options);
      return sonnerToast.warning(title || '', rest) as unknown as ToastT;
    },
    info: (options: ToastProps | string): ToastT => {
      const [title, rest] = handleToastParams(options);
      return sonnerToast.info(title || '', rest) as unknown as ToastT;
    },
    default: (options: ToastProps | string): ToastT => {
      const [title, rest] = handleToastParams(options);
      return sonnerToast(title || '', rest) as unknown as ToastT;
    },
    
    // Common scenarios with pre-defined messages
    saved: (): ToastT => sonnerToast.success('Successfully saved') as unknown as ToastT,
    deleted: (): ToastT => sonnerToast.success('Successfully deleted') as unknown as ToastT,
    updated: (): ToastT => sonnerToast.success('Successfully updated') as unknown as ToastT,
    created: (): ToastT => sonnerToast.success('Successfully created') as unknown as ToastT,
    loginSuccess: (): ToastT => sonnerToast.success('Successfully logged in') as unknown as ToastT,
    logoutSuccess: (): ToastT => sonnerToast.success('Successfully logged out') as unknown as ToastT,
    permissionDenied: (): ToastT => sonnerToast.error('Permission denied', { 
      description: 'You do not have permission to perform this action'
    }) as unknown as ToastT,
    networkError: (): ToastT => sonnerToast.error('Network error', { 
      description: 'Please check your connection and try again'
    }) as unknown as ToastT,
    sessionExpired: (): ToastT => sonnerToast.error('Session expired', { 
      description: 'Please log in again'
    }) as unknown as ToastT,
    validationError: (): ToastT => sonnerToast.error('Validation error', { 
      description: 'Please check the fields and try again'
    }) as unknown as ToastT,
    
    // Add for compatibility with shadcn/ui toast
    toast: sonnerToast,
    toasts: [] // Add empty array for shadcn compatibility
  }
);

export const useToast = () => {
  return { toast };
};
