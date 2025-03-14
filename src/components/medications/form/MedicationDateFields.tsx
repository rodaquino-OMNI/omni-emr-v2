
import React from 'react';
import MedicationDateField from './MedicationDateField';
import { useTranslation } from '@/hooks/useTranslation';

interface MedicationDateFieldsProps {
  startDate: Date;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
}

const MedicationDateFields = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: MedicationDateFieldsProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MedicationDateField
        label={language === 'pt' ? 'Data de Início' : 'Start Date'}
        value={startDate}
        onChange={(date) => date && onStartDateChange(date)}
      />
      
      <MedicationDateField
        label={language === 'pt' ? 'Data de Término' : 'End Date'}
        value={endDate}
        onChange={onEndDateChange}
        fromDate={startDate}
        optional={true}
      />
    </div>
  );
};

export default MedicationDateFields;
