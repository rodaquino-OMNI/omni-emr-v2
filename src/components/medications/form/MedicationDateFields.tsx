import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { FormField } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import MedicationDateField from './MedicationDateField';

interface MedicationDateFieldsProps {
  startDate?: Date;
  endDate?: Date | undefined;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
  control?: Control<any>;
}

const MedicationDateFields = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  control
}: MedicationDateFieldsProps) => {
  const { language } = useTranslation();
  
  if (control) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="startDate"
          render={({ field }) => (
            <MedicationDateField
              label={language === 'pt' ? 'Data de Início' : 'Start Date'}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        
        <FormField
          control={control}
          name="endDate"
          render={({ field }) => (
            <MedicationDateField
              label={language === 'pt' ? 'Data de Término' : 'End Date'}
              value={field.value}
              onChange={field.onChange}
              fromDate={startDate || new Date()}
              optional={true}
            />
          )}
        />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <MedicationDateField
        label={language === 'pt' ? 'Data de Início' : 'Start Date'}
        value={startDate || new Date()}
        onChange={(date) => onStartDateChange && date && onStartDateChange(date)}
      />
      
      <MedicationDateField
        label={language === 'pt' ? 'Data de Término' : 'End Date'}
        value={endDate}
        onChange={onEndDateChange}
        fromDate={startDate || new Date()}
        optional={true}
      />
    </div>
  );
};

export default MedicationDateFields;
