
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Building2, Phone, Video } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from '../types';
import { useTranslation } from '@/hooks/useTranslation';

interface ConsultationTypeSelectorProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const ConsultationTypeSelector = ({ form }: ConsultationTypeSelectorProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('consultationType')}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="in-person" />
                </FormControl>
                <FormLabel className="font-normal flex items-center">
                  <Building2 className="mr-2 h-4 w-4" />
                  {t('inPerson')}
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="telemedicine" />
                </FormControl>
                <FormLabel className="font-normal flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  {t('telemedicine')}
                </FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-3 space-y-0">
                <FormControl>
                  <RadioGroupItem value="phone" />
                </FormControl>
                <FormLabel className="font-normal flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  {t('phone')}
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default ConsultationTypeSelector;
