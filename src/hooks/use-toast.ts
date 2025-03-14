
import { toast as sonnerToast, type ToastT } from "sonner";

export type ToastOptions = {
  description?: string;
  duration?: number;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  className?: string;
  variant?: 'default' | 'destructive';
  title?: string;
};

type ToastFunction = {
  // Basic methods
  success: (message: string, options?: ToastOptions) => ToastT;
  error: (message: string, options?: ToastOptions) => ToastT;
  warning: (message: string, options?: ToastOptions) => ToastT;
  info: (message: string, options?: ToastOptions) => ToastT;
  default: (message: string, options?: ToastOptions) => ToastT;
  
  // Direct invocation as a function
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
  
  // Add properties for shadcn/ui compatibility
  toast: typeof sonnerToast;
  toasts: any[];
};

// Create the toast object with function properties
export const toast: ToastFunction = Object.assign(
  // Base function
  (message: string, options?: ToastOptions): ToastT => sonnerToast(message, options),
  // Methods
  {
    success: (message: string, options?: ToastOptions): ToastT => sonnerToast.success(message, options),
    error: (message: string, options?: ToastOptions): ToastT => sonnerToast.error(message, options),
    warning: (message: string, options?: ToastOptions): ToastT => sonnerToast.warning(message, options),
    info: (message: string, options?: ToastOptions): ToastT => sonnerToast.info(message, options),
    default: (message: string, options?: ToastOptions): ToastT => sonnerToast(message, options),
    
    // Common scenarios with pre-defined messages
    saved: (): ToastT => sonnerToast.success('Successfully saved'),
    deleted: (): ToastT => sonnerToast.success('Successfully deleted'),
    updated: (): ToastT => sonnerToast.success('Successfully updated'),
    created: (): ToastT => sonnerToast.success('Successfully created'),
    loginSuccess: (): ToastT => sonnerToast.success('Successfully logged in'),
    logoutSuccess: (): ToastT => sonnerToast.success('Successfully logged out'),
    permissionDenied: (): ToastT => sonnerToast.error('Permission denied', { 
      description: 'You do not have permission to perform this action'
    }),
    networkError: (): ToastT => sonnerToast.error('Network error', { 
      description: 'Please check your connection and try again'
    }),
    sessionExpired: (): ToastT => sonnerToast.error('Session expired', { 
      description: 'Please log in again'
    }),
    validationError: (): ToastT => sonnerToast.error('Validation error', { 
      description: 'Please check the fields and try again'
    }),
    
    // Add for compatibility with shadcn/ui toast
    toast: sonnerToast,
    toasts: [] // Add empty array for shadcn compatibility
  }
);

export const useToast = () => {
  const { language } = useLanguageHook();
  
  // Create toast function with translation support
  const translatedToast: ToastFunction = Object.assign(
    // Base function
    (message: string, options?: ToastOptions): ToastT => {
      return sonnerToast(message, options);
    },
    // Methods
    {
      success: (message: string, options?: ToastOptions): ToastT => {
        return sonnerToast.success(message, options);
      },
      error: (message: string, options?: ToastOptions): ToastT => {
        return sonnerToast.error(message, options);
      },
      warning: (message: string, options?: ToastOptions): ToastT => {
        return sonnerToast.warning(message, options);
      },
      info: (message: string, options?: ToastOptions): ToastT => {
        return sonnerToast.info(message, options);
      },
      default: (message: string, options?: ToastOptions): ToastT => {
        return sonnerToast(message, options);
      },
      
      // Common scenarios with pre-translated messages
      saved: (): ToastT => {
        return sonnerToast.success(
          language === 'pt' ? 'Salvo com sucesso' : 'Successfully saved'
        );
      },
      deleted: (): ToastT => {
        return sonnerToast.success(
          language === 'pt' ? 'Excluído com sucesso' : 'Successfully deleted'
        );
      },
      updated: (): ToastT => {
        return sonnerToast.success(
          language === 'pt' ? 'Atualizado com sucesso' : 'Successfully updated'
        );
      },
      created: (): ToastT => {
        return sonnerToast.success(
          language === 'pt' ? 'Criado com sucesso' : 'Successfully created'
        );
      },
      loginSuccess: (): ToastT => {
        return sonnerToast.success(
          language === 'pt' ? 'Login realizado com sucesso' : 'Successfully logged in'
        );
      },
      logoutSuccess: (): ToastT => {
        return sonnerToast.success(
          language === 'pt' ? 'Logout realizado com sucesso' : 'Successfully logged out'
        );
      },
      permissionDenied: (): ToastT => {
        return sonnerToast.error(
          language === 'pt' ? 'Permissão negada' : 'Permission denied',
          { description: language === 'pt' ? 'Você não tem permissão para realizar esta ação' : 'You do not have permission to perform this action' }
        );
      },
      networkError: (): ToastT => {
        return sonnerToast.error(
          language === 'pt' ? 'Erro de rede' : 'Network error',
          { description: language === 'pt' ? 'Verifique sua conexão e tente novamente' : 'Please check your connection and try again' }
        );
      },
      sessionExpired: (): ToastT => {
        return sonnerToast.error(
          language === 'pt' ? 'Sessão expirada' : 'Session expired',
          { description: language === 'pt' ? 'Por favor, faça login novamente' : 'Please log in again' }
        );
      },
      validationError: (): ToastT => {
        return sonnerToast.error(
          language === 'pt' ? 'Erro de validação' : 'Validation error',
          { description: language === 'pt' ? 'Por favor, verifique os campos e tente novamente' : 'Please check the fields and try again' }
        );
      },
      // Add compatibility with shadcn/ui toast
      toast: sonnerToast,
      toasts: [] // Add empty array for compatibility
    }
  );

  return translatedToast;
};

// Helper hook to get language without circular imports
const useLanguageHook = () => {
  const context = useLanguage();
  return { language: context.language };
};

// Import at the end to avoid circular dependencies
import { useLanguage } from "../context/LanguageContext";
