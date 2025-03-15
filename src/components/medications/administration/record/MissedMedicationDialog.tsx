
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MissedMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicationName?: string;
  dosage?: string;
  missedReason: string;
  onMissedReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

const MissedMedicationDialog: React.FC<MissedMedicationDialogProps> = ({
  open,
  onOpenChange,
  medicationName,
  dosage,
  missedReason,
  onMissedReasonChange,
  onConfirm
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('documentMissedDose')}</DialogTitle>
          <DialogDescription>
            {medicationName} {dosage}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="missed-reason">{t('reasonMissed')}</Label>
            <Textarea
              id="missed-reason"
              value={missedReason}
              onChange={(e) => onMissedReasonChange(e.target.value)}
              placeholder={t('enterReasonMissed')}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={!missedReason}>
            {t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MissedMedicationDialog;
