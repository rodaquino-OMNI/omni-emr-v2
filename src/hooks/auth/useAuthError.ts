
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Language } from '@/types/auth';

interface AuthError extends Error {
  message: string;
  status?: number;
  code?: string;
}

export const useAuthError = (language: Language) => {
  const [lastError, setLastError] = useState<AuthError | null>(null);

  // Common error handler to reduce duplication
  const handleAuthError = useCallback((error: any, context: string): AuthError => {
    const errorObj: AuthError = error instanceof Error 
      ? error 
      : new Error(error?.message || 'Unknown error');
    
    if (error?.status) errorObj.status = error.status;
    if (error?.code) errorObj.code = error.code;
    
    // Log with important details but avoid sensitive information
    console.error(`${context} error:`, {
      message: errorObj.message,
      status: errorObj.status,
      code: errorObj.code,
      // Don't log stack trace in production
      ...(process.env.NODE_ENV !== 'production' && { stack: errorObj.stack })
    });
    
    // Save last error for potential recovery strategies
    setLastError(errorObj);
    
    return errorObj;
  }, []);

  // Translate error messages based on language
  const getErrorMessage = useCallback((error: AuthError, context: string): string => {
    // Email already exists
    if (error.message?.includes('User already registered')) {
      return language === 'pt' 
        ? 'Este email já está registrado' 
        : 'This email is already registered';
    }
    
    // Invalid credentials
    if (error.message?.includes('Invalid login credentials')) {
      return language === 'pt'
        ? 'Credenciais inválidas'
        : 'Invalid login credentials';
    }

    // Rate limiting
    if (error.message?.includes('too many requests') || error.code === '429') {
      return language === 'pt'
        ? 'Muitas tentativas, tente novamente mais tarde'
        : 'Rate limited, please try again later';
    }
    
    // Network error
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return language === 'pt'
        ? 'Erro de conexão, verifique sua internet'
        : 'Connection error, check your internet';
    }

    // Default error message
    return error.message || (language === 'pt' 
      ? `Erro de ${context}` 
      : `${context} error`);
  }, [language]);

  return {
    lastError,
    handleAuthError,
    getErrorMessage
  };
};
