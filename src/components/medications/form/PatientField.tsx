
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import MedicationTextField from './MedicationTextField';

interface PatientFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPatientSelect?: (patientId: string) => void;
}

const PatientField = ({ value, onChange, onPatientSelect }: PatientFieldProps) => {
  const { language } = useTranslation();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (onPatientSelect) {
      onPatientSelect(e.target.value);
    }
  };
  
  return (
    <MedicationTextField
      id="patient"
      label={language === 'pt' ? 'ID do Paciente' : 'Patient ID'}
      value={value || ''}
      onChange={handleChange}
      required={true}
      placeholder={language === 'pt' ? 'Digite o ID do paciente' : 'Enter patient ID'}
    />
  );
};

export default PatientField;
