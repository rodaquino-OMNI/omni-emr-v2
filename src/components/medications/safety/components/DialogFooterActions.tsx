
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';

interface DialogFooterActionsProps {
  hasPassed: boolean;
  isOverrideConfirmed: boolean;
  onCancel: () => void;
  onProceedAnyway: () => void;
  onClose: () => void;
}

export function DialogFooterActions({
  hasPassed,
  isOverrideConfirmed,
  onCancel,
  onProceedAnyway,
  onClose
}: DialogFooterActionsProps) {
  const { t } = useTranslation();
  
  return (
    <div className="sm:justify-between flex justify-between w-full">
      <Button variant="outline" onClick={onCancel}>
        {t('cancel')}
      </Button>
      <div className="flex space-x-2">
        {!hasPassed && (
          <Button 
            variant="destructive" 
            onClick={onProceedAnyway}
            disabled={isOverrideConfirmed}
          >
            {t('proceedAnyway')}
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={!hasPassed && !isOverrideConfirmed}
          onClick={onClose}
          className="flex items-center"
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          {t('acknowledgeAndProceed')}
        </Button>
      </div>
    </div>
  );
}
