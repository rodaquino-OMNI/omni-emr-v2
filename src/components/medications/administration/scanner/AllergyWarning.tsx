
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertTriangle } from 'lucide-react';

interface AllergyWarningProps {
  patient: any;
  medication: any;
}

const AllergyWarning: React.FC<AllergyWarningProps> = ({ patient, medication }) => {
  const { t } = useTranslation();
  
  if (!patient || !medication) return null;
  
  const hasAllergy = patient.allergies.some((allergy: string) => 
    medication.medicationName.toLowerCase().includes(allergy.toLowerCase())
  );
  
  if (!hasAllergy) return null;
  
  return (
    <div className="mt-2 bg-red-50 border border-red-200 rounded-md p-2 text-left">
      <div className="flex items-center font-medium text-red-800 text-sm">
        <AlertTriangle className="h-4 w-4 mr-1 text-red-600" />
        {t('allergyWarning')}
      </div>
      <p className="text-xs text-red-700 mt-1">
        {t('patientHasAllergy', { medication: medication.medicationName })}
      </p>
    </div>
  );
};

export default AllergyWarning;
