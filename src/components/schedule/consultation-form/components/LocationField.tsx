
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ConsultationFormValues } from '../types';
import { useTranslation } from '@/hooks/useTranslation';

interface LocationFieldProps {
  form: UseFormReturn<ConsultationFormValues>;
}

const LocationField = ({ form }: LocationFieldProps) => {
  const { t } = useTranslation();
  
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('location')}</FormLabel>
          <FormControl>
            <Input 
              placeholder={
                form.watch('type') === 'in-person' 
                  ? "Room 302, Building A" 
                  : form.watch('type') === 'telemedicine'
                    ? "Video call link will be sent"
                    : "Phone number will be called"
              } 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
