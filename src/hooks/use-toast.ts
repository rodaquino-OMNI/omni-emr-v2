
import { toast as sonnerToast } from "sonner";
import { useTranslation } from "./useTranslation";

type ToastOptions = {
  description?: string;
  duration?: number;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  className?: string;
};

export function useToast() {
  const { language } = useTranslation();
  
  // Create toast function with translation support
  const toast = {
    // Basic methods
    success: (message: string, options?: ToastOptions) => {
      return sonnerToast.success(message, options);
    },
    error: (message: string, options?: ToastOptions) => {
      return sonnerToast.error(message, options);
    },
    warning: (message: string, options?: ToastOptions) => {
      return sonnerToast.warning(message, options);
    },
    info: (message: string, options?: ToastOptions) => {
      return sonnerToast.info(message, options);
    },
    
    default: (message: string, options?: ToastOptions) => {
      return sonnerToast(message, options);
    },
    
    // Common scenarios with pre-translated messages
    saved: () => {
      return sonnerToast.success(
        language === 'pt' ? 'Salvo com sucesso' : 'Successfully saved'
      );
    },
    deleted: () => {
      return sonnerToast.success(
        language === 'pt' ? 'Excluído com sucesso' : 'Successfully deleted'
      );
    },
    updated: () => {
      return sonnerToast.success(
        language === 'pt' ? 'Atualizado com sucesso' : 'Successfully updated'
      );
    },
    created: () => {
      return sonnerToast.success(
        language === 'pt' ? 'Criado com sucesso' : 'Successfully created'
      );
    },
    loginSuccess: () => {
      return sonnerToast.success(
        language === 'pt' ? 'Login realizado com sucesso' : 'Successfully logged in'
      );
    },
    logoutSuccess: () => {
      return sonnerToast.success(
        language === 'pt' ? 'Logout realizado com sucesso' : 'Successfully logged out'
      );
    },
    permissionDenied: () => {
      return sonnerToast.error(
        language === 'pt' ? 'Permissão negada' : 'Permission denied',
        { description: language === 'pt' ? 'Você não tem permissão para realizar esta ação' : 'You do not have permission to perform this action' }
      );
    },
    networkError: () => {
      return sonnerToast.error(
        language === 'pt' ? 'Erro de rede' : 'Network error',
        { description: language === 'pt' ? 'Verifique sua conexão e tente novamente' : 'Please check your connection and try again' }
      );
    },
    sessionExpired: () => {
      return sonnerToast.error(
        language === 'pt' ? 'Sessão expirada' : 'Session expired',
        { description: language === 'pt' ? 'Por favor, faça login novamente' : 'Please log in again' }
      );
    },
    validationError: () => {
      return sonnerToast.error(
        language === 'pt' ? 'Erro de validação' : 'Validation error',
        { description: language === 'pt' ? 'Por favor, verifique os campos e tente novamente' : 'Please check the fields and try again' }
      );
    }
  };

  return toast;
}

// Re-export toast for direct imports
export const toast = {
  // Basic methods
  success: (message: string, options?: ToastOptions) => sonnerToast.success(message, options),
  error: (message: string, options?: ToastOptions) => sonnerToast.error(message, options),
  warning: (message: string, options?: ToastOptions) => sonnerToast.warning(message, options),
  info: (message: string, options?: ToastOptions) => sonnerToast.info(message, options),
  
  // Default toast
  default: (message: string, options?: ToastOptions) => sonnerToast(message, options),
};
