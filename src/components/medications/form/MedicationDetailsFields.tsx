
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import MedicationTextField from './MedicationTextField';

interface MedicationDetailsFieldsProps {
  name: string;
  dosage: string;
  frequency: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDosageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFrequencyChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MedicationDetailsFields = ({
  name,
  dosage,
  frequency,
  onNameChange,
  onDosageChange,
  onFrequencyChange
}: MedicationDetailsFieldsProps) => {
  const { language } = useTranslation();
  
  return (
    <>
      <MedicationTextField
        id="name"
        label={language === 'pt' ? 'Nome do Medicamento' : 'Medication Name'}
        value={name}
        onChange={onNameChange}
        required={true}
        placeholder={language === 'pt' ? 'Ex: Lisinopril' : 'Ex: Lisinopril'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MedicationTextField
          id="dosage"
          label={language === 'pt' ? 'Dosagem' : 'Dosage'}
          value={dosage}
          onChange={onDosageChange}
          required={true}
          placeholder={language === 'pt' ? 'Ex: 10mg' : 'Ex: 10mg'}
        />
        
        <MedicationTextField
          id="frequency"
          label={language === 'pt' ? 'Frequência' : 'Frequency'}
          value={frequency}
          onChange={onFrequencyChange}
          required={true}
          placeholder={language === 'pt' ? 'Ex: Uma vez ao dia' : 'Ex: Once daily'}
        />
      </div>
    </>
  );
};

export default MedicationDetailsFields;
