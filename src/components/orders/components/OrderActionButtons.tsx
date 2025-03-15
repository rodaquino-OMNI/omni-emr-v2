
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OrderActionButtonsProps {
  onCancel: () => void;
  onVerify: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

const OrderActionButtons = ({ 
  onCancel, 
  onVerify, 
  isSubmitting, 
  isValid 
}: OrderActionButtonsProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={onCancel}
        size="sm"
        className="text-gray-600"
      >
        <XCircle className="mr-2 h-4 w-4" />
        {language === 'pt' ? 'Cancelar' : 'Cancel'}
      </Button>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={onVerify}
              disabled={isSubmitting || !isValid}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  {language === 'pt' ? 'Verificando...' : 'Verifying...'}
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Verificar com IA' : 'Verify with AI'}
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-md p-3">
            <div className="space-y-2">
              <p className="font-medium">
                {language === 'pt' ? 'Verificação de segurança por IA' : 'AI Safety Verification'}
              </p>
              <p className="text-xs">
                {language === 'pt' 
                  ? 'Seu pedido será analisado por nossa IA para identificar possíveis problemas de segurança, como interações medicamentosas, alergias e doses inadequadas.' 
                  : 'Your order will be analyzed by our AI to identify potential safety issues, such as drug interactions, allergies, and inappropriate dosages.'}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default OrderActionButtons;
