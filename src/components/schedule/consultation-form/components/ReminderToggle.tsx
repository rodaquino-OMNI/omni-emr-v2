
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from '../types';
import { useTranslation } from '@/hooks/useTranslation';

interface ReminderToggleProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const ReminderToggle = ({ form }: ReminderToggleProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="sendReminder"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{t('sendReminder')}</FormLabel>
            <FormDescription>
              {t('reminderDescription')}
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ReminderToggle;
