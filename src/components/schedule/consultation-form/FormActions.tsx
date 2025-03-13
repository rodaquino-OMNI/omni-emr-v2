
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onCancel
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-end space-x-2 pt-4">
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '...' : t('scheduleConsultation')}
      </Button>
    </div>
  );
};

export default FormActions;
