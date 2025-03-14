
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from '../types';
import { useTranslation } from '@/hooks/useTranslation';

interface TimeSelectorProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const TimeSelector = ({ form }: TimeSelectorProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('appointmentTime')}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('selectTime')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Array.from({ length: 24 }, (_, hour) => {
                return [
                  <SelectItem key={`${hour}:00`} value={`${hour.toString().padStart(2, '0')}:00`}>
                    {`${hour.toString().padStart(2, '0')}:00`}
                  </SelectItem>,
                  <SelectItem key={`${hour}:30`} value={`${hour.toString().padStart(2, '0')}:30`}>
                    {`${hour.toString().padStart(2, '0')}:30`}
                  </SelectItem>
                ];
              }).flat()}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TimeSelector;
