
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { CheckCircle2 } from 'lucide-react';

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
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel}>
        {language === 'pt' ? 'Cancelar' : 'Cancel'}
      </Button>
      <Button 
        onClick={onVerify}
        disabled={isSubmitting || !isValid}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
            {language === 'pt' ? 'Verificando...' : 'Verifying...'}
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {language === 'pt' ? 'Verificar e Enviar' : 'Verify & Submit'}
          </>
        )}
      </Button>
    </div>
  );
};

export default OrderActionButtons;
