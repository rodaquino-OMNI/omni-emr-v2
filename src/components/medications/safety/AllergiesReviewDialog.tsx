
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PatientAllergy } from '@/hooks/useMedicationSafety';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

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

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'moderate':
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'mild':
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-muted-foreground">{t('loading')}</p>
            </div>
          ) : allergies.length === 0 ? (
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
              <p className="mt-2 font-medium">{t('noKnownAllergies')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allergies.map((allergy) => (
                <div key={allergy.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start">
                    <div className="font-medium">{allergy.allergen}</div>
                    {allergy.severity && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(allergy.severity)}`}>
                        {allergy.severity}
                      </div>
                    )}
                  </div>
                  {allergy.reaction && (
                    <div className="mt-1 text-sm text-muted-foreground flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {allergy.reaction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {t('allergiesReviewed')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
