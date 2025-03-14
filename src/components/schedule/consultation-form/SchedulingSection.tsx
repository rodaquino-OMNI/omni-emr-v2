
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from './types';
import { useTranslation } from '@/hooks/useTranslation';
import DateSelector from './components/DateSelector';
import TimeSelector from './components/TimeSelector';
import DurationSelector from './components/DurationSelector';
import ConsultationTypeSelector from './components/ConsultationTypeSelector';
import LocationField from './components/LocationField';
import ReminderToggle from './components/ReminderToggle';

interface SchedulingSectionProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const SchedulingSection: React.FC<SchedulingSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{t('schedulingInformation')}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateSelector form={form} />
        <TimeSelector form={form} />
      </div>
      
      <div className="mt-4">
        <DurationSelector form={form} />
      </div>
      
      <div className="mt-4">
        <ConsultationTypeSelector form={form} />
      </div>
      
      <div className="mt-4">
        <LocationField form={form} />
      </div>
      
      <div className="mt-6">
        <ReminderToggle form={form} />
      </div>
    </div>
  );
};

export default SchedulingSection;
