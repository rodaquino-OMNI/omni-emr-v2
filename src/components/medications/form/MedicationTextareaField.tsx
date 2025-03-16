import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';

interface MedicationTextareaFieldProps {
  id?: string;
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  control?: Control<any>;
}

const MedicationTextareaField = ({
  id,
  name,
  label,
  value,
  onChange,
  control,
  required = false,
  placeholder = '',
}: MedicationTextareaFieldProps) => {
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Textarea
                id={id || name}
                placeholder={placeholder}
                required={required}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }
  
  return (
    <div>
      <Label htmlFor={id}>
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MedicationTextareaField;
