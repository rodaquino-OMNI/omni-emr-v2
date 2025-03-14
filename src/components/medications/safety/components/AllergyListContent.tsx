
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { PatientAllergy } from '@/hooks/useMedicationSafety';
import { AllergyListItem } from './AllergyListItem';
import { CheckCircle2 } from 'lucide-react';

interface AllergyListContentProps {
  allergies: PatientAllergy[];
  isLoading: boolean;
}

export function AllergyListContent({ 
  allergies,
  isLoading 
}: AllergyListContentProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (allergies.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-gray-50">
        <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
        <p className="mt-2 font-medium">{t('noKnownAllergies')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allergies.map((allergy) => (
        <AllergyListItem key={allergy.id} allergy={allergy} />
      ))}
    </div>
  );
}
