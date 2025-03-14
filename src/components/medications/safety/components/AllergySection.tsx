
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AllergySectionProps {
  isAllergyReviewed: boolean;
  hasAllergyWarning: boolean;
  allergyWarningDetails?: string[];
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
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">{t('verifyAllergies')}</h3>
        {isAllergyReviewed ? (
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
      
      {hasAllergyWarning && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">{t('allergyWarning')}</p>
              <p className="text-sm text-red-700 mt-1">{t('allergyWarningDescription')}</p>
              <ul className="list-disc pl-5 mt-2 text-sm text-red-700">
                {allergyWarningDetails?.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <Button
        variant={isAllergyReviewed ? "outline" : "default"}
        onClick={onReviewAllergies}
        className="w-full"
      >
        {isAllergyReviewed ? t('reviewComplete') : t('reviewAllergies')}
      </Button>
    </div>
  );
}
