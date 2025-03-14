
import React, { useState } from 'react';
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
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Weight,
  Shield,
  ThumbsUp
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MedicationSafetyCheck } from '@/hooks/useMedicationSafety';

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
  const [newWeight, setNewWeight] = useState<string>('');
  const [isUpdatingWeight, setIsUpdatingWeight] = useState(false);
  const [isOverrideConfirmed, setIsOverrideConfirmed] = useState(false);
  
  const handleWeightUpdate = async () => {
    if (!newWeight) return;
    
    setIsUpdatingWeight(true);
    const weight = parseFloat(newWeight);
    
    if (isNaN(weight) || weight <= 0) {
      setIsUpdatingWeight(false);
      return;
    }
    
    const success = await onUpdateWeight(weight);
    setIsUpdatingWeight(false);
    
    if (success) {
      setNewWeight('');
    }
  };
  
  const handleProceedAnyway = () => {
    setIsOverrideConfirmed(true);
    onProceedAnyway();
  };
  
  // Format the date to a readable string
  const formatDate = (date?: Date) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
            {safetyCheck.hasPassed ? (
              <div className="flex items-center text-green-600 mt-2">
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('safetyCheckPassed')}
              </div>
            ) : (
              <div className="flex items-center text-amber-600 mt-2">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {t('safetyCheckFailed')}
              </div>
            )}
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
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">{t('verifyAllergies')}</h3>
              {safetyCheck.isAllergyReviewed ? (
                <span className="text-green-600 flex items-center text-sm">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  {t('allergiesReviewed')}
                </span>
              ) : (
                <span className="text-amber-600 flex items-center text-sm">
                  <Clock className="mr-1 h-4 w-4" />
                  {t('allergiesNotReviewed')}
                </span>
              )}
            </div>
            
            {safetyCheck.hasAllergyWarning && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">{t('allergyWarning')}</p>
                    <p className="text-sm text-red-700 mt-1">{t('allergyWarningDescription')}</p>
                    <ul className="list-disc pl-5 mt-2 text-sm text-red-700">
                      {safetyCheck.allergyWarningDetails?.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              variant={safetyCheck.isAllergyReviewed ? "outline" : "default"}
              onClick={onReviewAllergies}
              className="w-full"
            >
              {safetyCheck.isAllergyReviewed ? t('reviewComplete') : t('reviewAllergies')}
            </Button>
          </div>
          
          {/* Weight-Based Section (if applicable) */}
          {safetyCheck.isWeightBased && (
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium flex items-center">
                  <Weight className="mr-2 h-4 w-4" />
                  {t('weightBasedDosing')}
                </h3>
                {safetyCheck.isWeightVerified ? (
                  <span className="text-green-600 flex items-center text-sm">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    {t('verifyPatientWeight')}
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center text-sm">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    {t('weightBasedDosingRequired')}
                  </span>
                )}
              </div>
              
              {safetyCheck.patientWeight && (
                <div className="flex justify-between text-sm mb-4">
                  <span>
                    {t('patientWeight')}: <strong>{safetyCheck.patientWeight} kg</strong>
                  </span>
                  <span className="text-muted-foreground">
                    {t('lastUpdated')}: {formatDate(safetyCheck.weightLastUpdated)}
                  </span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="weight">{t('updateWeight')}</Label>
                <div className="flex space-x-2">
                  <Input
                    id="weight"
                    type="number"
                    placeholder="kg"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                  />
                  <Button 
                    onClick={handleWeightUpdate} 
                    disabled={isUpdatingWeight || !newWeight}
                  >
                    {isUpdatingWeight ? t('updating') : t('update')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <div className="flex space-x-2">
            {!safetyCheck.hasPassed && (
              <Button 
                variant="destructive" 
                onClick={handleProceedAnyway}
                disabled={isOverrideConfirmed}
              >
                {t('proceedAnyway')}
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={!safetyCheck.hasPassed && !isOverrideConfirmed}
              onClick={onClose}
              className="flex items-center"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              {t('acknowledgeAndProceed')}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
