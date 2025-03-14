
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface AllergiesDialogFooterProps {
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function AllergiesDialogFooter({
  onClose,
  onConfirm,
  isLoading
}: AllergiesDialogFooterProps) {
  const { t } = useTranslation();
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>
        {t('cancel')}
      </Button>
      <Button onClick={handleConfirm} disabled={isLoading}>
        {t('allergiesReviewed')}
      </Button>
    </DialogFooter>
  );
}
