
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertCircle } from 'lucide-react';
import { MedicationData } from './types';

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
  
  if (!hasAllergy) return null;
  
  return (
    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start">
      <AlertCircle className="h-5 w-5 mr-2 text-red-600 shrink-0 mt-0.5" />
      <div>
        <div className="font-medium">{t('allergyWarning')}</div>
        <div className="mt-1">
          {t('patientHasAllergy')}
        </div>
      </div>
    </div>
  );
};

export default AllergyWarning;
