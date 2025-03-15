
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertCircle, Shield } from 'lucide-react';
import { MedicationData } from './types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AllergyWarningProps {
  patient: any;
  medication: MedicationData;
}

const AllergyWarning: React.FC<AllergyWarningProps> = ({ patient, medication }) => {
  const { t } = useTranslation();
  
  if (!patient?.allergies || !medication) return null;
  
  const hasAllergy = patient.allergies.some((allergy: string) => 
    medication.medicationName.toLowerCase().includes(allergy.toLowerCase())
  );
  
  if (!hasAllergy) {
    return (
      <Alert variant="success" className="mt-2 bg-green-50 border-green-200 text-green-800">
        <Shield className="h-4 w-4 text-green-600" />
        <AlertTitle>{t('safetyCheck')}</AlertTitle>
        <AlertDescription>
          {t('noKnownAllergies') || 'No known allergies to this medication'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="destructive" className="mt-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t('allergyWarning') || 'Allergy Warning'}</AlertTitle>
      <AlertDescription>
        {t('patientHasAllergy') || 'Patient has a documented allergy to this medication'}
      </AlertDescription>
    </Alert>
  );
};

export default AllergyWarning;
