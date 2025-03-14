
import { toast as sonnerToast, type ToastT } from "sonner";

export type ToastOptions = {
  description?: string;
  duration?: number;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  className?: string;
};

type ToastFunction = {
  // Basic methods
  success: (message: string, options?: ToastOptions) => ToastT;
  error: (message: string, options?: ToastOptions) => ToastT;
  warning: (message: string, options?: ToastOptions) => ToastT;
  info: (message: string, options?: ToastOptions) => ToastT;
  default: (message: string, options?: ToastOptions) => ToastT;
  
  // Also allow direct invocation as a function
  (message: string, options?: ToastOptions): ToastT;
};

// Create the toast object with function properties
export const toast: ToastFunction = Object.assign(
  // Base function
  (message: string, options?: ToastOptions): ToastT => sonnerToast(message, options),
  // Methods
  {
    success: (message: string, options?: ToastOptions) => sonnerToast.success(message, options),
    error: (message: string, options?: ToastOptions) => sonnerToast.error(message, options),
    warning: (message: string, options?: ToastOptions) => sonnerToast.warning(message, options),
    info: (message: string, options?: ToastOptions) => sonnerToast.info(message, options),
    default: (message: string, options?: ToastOptions) => sonnerToast(message, options),
  }
);

export const useToast = () => {
  const { language } = useTranslationHook();
  
  // Create toast function with translation support
  const translatedToast: ToastFunction & {
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
    toasts?: any; // Add this property to make it compatible with Shadcn UI toast
  } = Object.assign(
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
const useTranslationHook = () => {
  const context = useLanguage();
  return { language: context.language };
};

// Import at the end to avoid circular dependencies
import { useLanguage } from "../context/LanguageContext";
