
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from './types';

interface ConsultationDetailsSectionProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const ConsultationDetailsSection: React.FC<ConsultationDetailsSectionProps> = ({ form }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">{t('consultationDetails')}</h3>
      
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('consultationTitle')}</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Follow-up Appointment" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>{t('notes')}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any special instructions or notes" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ConsultationDetailsSection;
