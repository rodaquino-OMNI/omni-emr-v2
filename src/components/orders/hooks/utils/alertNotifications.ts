
import { Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/**
 * Shows a toast notification that AI is analyzing the order
 */
export const showAnalyzingOrderToast = (language: string) => {
  toast({
    title: language === 'pt' ? 'Verificando pedido' : 'Verifying order',
    description: language === 'pt' 
      ? 'Nossa IA está analisando o pedido para garantir a segurança' 
      : 'Our AI is analyzing the order to ensure safety',
    variant: "default",
    icon: { icon: Shield, className: "h-4 w-4 text-purple-600" }
  });
};

/**
 * Shows a toast notification when verification is complete with no issues
 */
export const showVerificationSuccessToast = (language: string) => {
  toast({
    title: language === 'pt' ? 'Verificação concluída' : 'Verification completed',
    description: language === 'pt'
      ? 'Nenhum problema foi encontrado pela IA'
      : 'No issues were found by the AI',
    variant: "success",
    icon: { icon: Shield, className: "h-4 w-4 text-green-600" }
  });
};

/**
 * Shows a toast notification when verification fails
 */
export const showVerificationErrorToast = (language: string) => {
  toast({
    title: language === 'pt' ? 'Erro' : 'Error',
    description: language === 'pt' 
      ? 'Falha ao verificar alertas. Deseja prosseguir mesmo assim?' 
      : 'Failed to check for alerts. Do you want to proceed anyway?',
    variant: "destructive"
  });
};
