
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface MedicationFormButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

const MedicationFormButtons = ({
  isSubmitting,
  onCancel,
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
      <Button 
        type="submit" 
        disabled={isSubmitting}
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
