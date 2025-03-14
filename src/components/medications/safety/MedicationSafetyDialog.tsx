
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Shield } from 'lucide-react';
import { MedicationSafetyCheck } from '@/hooks/useMedicationSafety';
import { AllergySection } from './components/AllergySection';
import { WeightBasedSection } from './components/WeightBasedSection';
import { DialogFooterActions } from './components/DialogFooterActions';
import { SafetyStatusIndicator } from './components/SafetyStatusIndicator';

interface MedicationSafetyDialogProps {
  open: boolean;
  onClose: () => void;
  safetyCheck: MedicationSafetyCheck;
  medicationName: string;
  onReviewAllergies: () => void;
  onUpdateWeight: (weight: number) => Promise<boolean>;
  onProceedAnyway: () => void;
  onCancel: () => void;
}

export function MedicationSafetyDialog({
  open,
  onClose,
  safetyCheck,
  medicationName,
  onReviewAllergies,
  onUpdateWeight,
  onProceedAnyway,
  onCancel
}: MedicationSafetyDialogProps) {
  const { t } = useTranslation();
  const [isOverrideConfirmed, setIsOverrideConfirmed] = useState(false);
  
  const handleProceedAnyway = () => {
    setIsOverrideConfirmed(true);
    onProceedAnyway();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            {t('medicationSafety')}
          </DialogTitle>
          <DialogDescription>
            <SafetyStatusIndicator hasPassed={safetyCheck.hasPassed} />
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Medication Name */}
          <div className="text-center font-medium text-lg">
            {medicationName}
            {safetyCheck.isHighRiskMedication && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {t('highRiskMedication')}
              </span>
            )}
          </div>
          
          {/* Allergy Section */}
          <AllergySection 
            isAllergyReviewed={safetyCheck.isAllergyReviewed}
            hasAllergyWarning={safetyCheck.hasAllergyWarning}
            allergyWarningDetails={safetyCheck.allergyWarningDetails}
            onReviewAllergies={onReviewAllergies}
          />
          
          {/* Weight-Based Section (if applicable) */}
          <WeightBasedSection 
            isWeightBased={safetyCheck.isWeightBased}
            isWeightVerified={safetyCheck.isWeightVerified}
            patientWeight={safetyCheck.patientWeight}
            weightLastUpdated={safetyCheck.weightLastUpdated}
            onUpdateWeight={onUpdateWeight}
          />
        </div>
        
        <DialogFooter>
          <DialogFooterActions 
            hasPassed={safetyCheck.hasPassed}
            isOverrideConfirmed={isOverrideConfirmed}
            onCancel={onCancel}
            onProceedAnyway={handleProceedAnyway}
            onClose={onClose}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
