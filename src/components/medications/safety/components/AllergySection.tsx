
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PatientAllergy } from '@/hooks/medication-safety/constants';
import { Shield, AlertTriangle } from 'lucide-react';

interface AllergySectionProps {
  isAllergyReviewed: boolean;
  hasAllergyWarning: boolean;
  allergyWarningDetails: PatientAllergy[];
  onReviewAllergies: () => void;
}

export function AllergySection({
  isAllergyReviewed,
  hasAllergyWarning,
  allergyWarningDetails,
  onReviewAllergies
}: AllergySectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{t('allergyCheck')}</h3>
      
      {!isAllergyReviewed ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('allergiesNotReviewed')}</AlertTitle>
          <AlertDescription>
            {t('pleaseReviewPatientAllergies')}
          </AlertDescription>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2" 
            onClick={onReviewAllergies}
          >
            {t('reviewAllergies')}
          </Button>
        </Alert>
      ) : hasAllergyWarning ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('allergyWarning')}</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {allergyWarningDetails.map((allergy) => (
                <li key={allergy.id} className="text-sm">
                  <span className="font-medium">{allergy.allergen}</span>
                  {allergy.severity && <span> ({allergy.severity})</span>}
                  {allergy.reaction && <span>: {allergy.reaction}</span>}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default" className="border-green-500 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <Shield className="h-4 w-4" />
          <AlertTitle>{t('noAllergyWarnings')}</AlertTitle>
          <AlertDescription>
            {t('patientAllergiesReviewed')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
