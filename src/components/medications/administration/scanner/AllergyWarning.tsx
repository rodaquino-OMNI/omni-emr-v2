
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertCircle, Shield, Check, AlertTriangle } from 'lucide-react';
import { MedicationData } from './types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

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
      <Alert variant="success" className="mt-3 bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 animate-fade-in shadow-sm">
        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
        <AlertTitle className="flex items-center">
          {t('safetyCheck')}
          <Badge variant="outline" className="ml-2 bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800 text-xs px-1.5">
            <Check className="h-3 w-3 mr-0.5" />
            EHR-Verified
          </Badge>
        </AlertTitle>
        <AlertDescription className="mt-1">
          {t('noKnownAllergies') || 'No known allergies to this medication have been found in patient records'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert variant="destructive" className="mt-3 border-red-300 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50 animate-fade-in shadow-sm">
      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
      <AlertTitle className="flex items-center">
        {t('allergyWarning') || 'Allergy Warning'}
        <Badge variant="outline" className="ml-2 bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800 text-xs px-1.5">
          <AlertCircle className="h-3 w-3 mr-0.5" />
          EHR-Alert
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-1 font-medium">
        {t('patientHasAllergy') || 'Patient has a documented allergy to this medication in their medical records'}
      </AlertDescription>
    </Alert>
  );
};

export default AllergyWarning;
