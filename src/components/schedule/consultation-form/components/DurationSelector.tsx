
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from '../types';
import { useTranslation } from '@/hooks/useTranslation';

interface DurationSelectorProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const DurationSelector = ({ form }: DurationSelectorProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('duration')} ({t('minutes')})</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(parseInt(value))}
            defaultValue={field.value.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={t('selectDuration')} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="15">15 {t('minutes')}</SelectItem>
              <SelectItem value="30">30 {t('minutes')}</SelectItem>
              <SelectItem value="45">45 {t('minutes')}</SelectItem>
              <SelectItem value="60">60 {t('minutes')}</SelectItem>
              <SelectItem value="90">90 {t('minutes')}</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DurationSelector;
