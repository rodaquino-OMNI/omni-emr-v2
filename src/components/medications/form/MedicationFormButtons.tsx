
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Save, AlertTriangle } from 'lucide-react';

interface MedicationFormButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  interactionsLoading?: boolean;
}

const MedicationFormButtons = ({
  isSubmitting,
  onCancel,
  interactionsLoading
}: MedicationFormButtonsProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {language === 'pt' ? 'Cancelar' : 'Cancel'}
      </Button>
      
      {interactionsLoading && (
        <Button type="button" variant="outline" disabled className="flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" />
          {language === 'pt' ? 'Verificando interações...' : 'Checking interactions...'}
        </Button>
      )}
      
      <Button 
        type="submit" 
        disabled={isSubmitting || interactionsLoading}
        className="flex items-center gap-1"
      >
        {isSubmitting ? (
          language === 'pt' ? 'Salvando...' : 'Saving...'
        ) : (
          <>
            <Save className="h-4 w-4" />
            {language === 'pt' ? 'Salvar Medicamento' : 'Save Medication'}
          </>
        )}
      </Button>
    </div>
  );
};

export default MedicationFormButtons;
