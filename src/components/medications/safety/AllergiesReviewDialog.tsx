
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PatientAllergy } from '@/hooks/useMedicationSafety';
import { AllergyListContent } from './components/AllergyListContent';
import { AllergiesDialogFooter } from './components/AllergiesDialogFooter';

interface AllergiesReviewDialogProps {
  open: boolean;
  onClose: () => void;
  allergies: PatientAllergy[];
  isLoading: boolean;
  onConfirm: () => void;
}

export function AllergiesReviewDialog({
  open,
  onClose,
  allergies,
  isLoading,
  onConfirm
}: AllergiesReviewDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('reviewAllergies')}</DialogTitle>
          <DialogDescription>
            {t('pleaseReviewPatientAllergies')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <AllergyListContent 
            allergies={allergies} 
            isLoading={isLoading} 
          />
        </div>

        <AllergiesDialogFooter 
          onClose={onClose} 
          onConfirm={onConfirm} 
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
