
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import MedicationTextField from './MedicationTextField';

interface PatientFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientField = ({ value, onChange }: PatientFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <MedicationTextField
      id="patient"
      label={language === 'pt' ? 'ID do Paciente' : 'Patient ID'}
      value={value}
      onChange={onChange}
      required={true}
      placeholder={language === 'pt' ? 'Digite o ID do paciente' : 'Enter patient ID'}
    />
  );
};

export default PatientField;
