
import { ToasterToast, useToast as useToasterToast } from "sonner";
import { useTranslation } from "./useTranslation";

// Define commonly used toast messages with translations
type CommonToastMessage = 
  | 'success'
  | 'error'
  | 'saved'
  | 'deleted'
  | 'updated'
  | 'created'
  | 'loginSuccess'
  | 'logoutSuccess'
  | 'permissionDenied'
  | 'networkError'
  | 'sessionExpired'
  | 'validationError';

export function useToast() {
  const sonnerToast = useToasterToast();
  const { t, language } = useTranslation();
  
  // Create toast function with translation support
  const toast = Object.assign(
    // Main function for custom message
    (message: string, options?: Omit<ToasterToast, "id" | "title" | "description"> & { description?: string }) => {
      return sonnerToast(message, options);
    },
    
    // Common toast variations with pre-translated messages
    {
      success: (message: string, options?: Omit<ToasterToast, "id" | "title" | "description"> & { description?: string }) => {
        return sonnerToast.success(message, options);
      },
      error: (message: string, options?: Omit<ToasterToast, "id" | "title" | "description"> & { description?: string }) => {
        return sonnerToast.error(message, options);
      },
      warning: (message: string, options?: Omit<ToasterToast, "id" | "title" | "description"> & { description?: string }) => {
        return sonnerToast.warning(message, options);
      },
      info: (message: string, options?: Omit<ToasterToast, "id" | "title" | "description"> & { description?: string }) => {
        return sonnerToast.info(message, options);
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
          t('loginSuccess'), 
          { description: t('welcomeBack') }
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
    }
  );

  return {
    ...sonnerToast,
    toast
  };
}

// Re-export toast for direct imports
export const toast = {
  // Basic methods
  success: (message: string, options?: any) => useToasterToast.success(message, options),
  error: (message: string, options?: any) => useToasterToast.error(message, options),
  warning: (message: string, options?: any) => useToasterToast.warning(message, options),
  info: (message: string, options?: any) => useToasterToast.info(message, options),
  
  // Default toast
  default: (message: string, options?: any) => useToasterToast(message, options),
};
