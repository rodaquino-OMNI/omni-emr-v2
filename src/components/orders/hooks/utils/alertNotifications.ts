
import { toast } from 'sonner';
import React from 'react';
import { Brain, Check, AlertCircle } from 'lucide-react';

/**
 * Shows a toast notification indicating that AI is analyzing the order
 */
export function showAnalyzingOrderToast(language: string): void {
  toast.info(
    language === 'pt' ? 'Analisando pedido' : 'Analyzing order',
    {
      description: language === 'pt' 
        ? 'A IA está verificando seu pedido quanto a possíveis problemas' 
        : 'AI is checking your order for potential issues',
      icon: React.createElement(Brain, { className: 'h-5 w-5 text-blue-600' })
    }
  );
}

/**
 * Shows a toast notification indicating successful verification without alerts
 */
export function showVerificationSuccessToast(language: string): void {
  toast.success(
    language === 'pt' ? 'Pedido verificado' : 'Order verified',
    {
      description: language === 'pt' 
        ? 'Não foram encontrados problemas com seu pedido' 
        : 'No issues were found with your order',
      icon: React.createElement(Check, { className: 'h-5 w-5 text-green-600' })
    }
  );
}

/**
 * Shows a toast notification indicating there was an error during verification
 */
export function showVerificationErrorToast(language: string): void {
  toast.error(
    language === 'pt' ? 'Erro de verificação' : 'Verification error',
    {
      description: language === 'pt' 
        ? 'Ocorreu um erro ao verificar o pedido' 
        : 'There was an error verifying the order',
      icon: React.createElement(AlertCircle, { className: 'h-5 w-5 text-red-600' })
    }
  );
}
