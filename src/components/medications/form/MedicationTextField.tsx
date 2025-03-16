import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';

interface MedicationTextFieldProps {
  id?: string;
  name?: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  control?: Control<any>;
}

const MedicationTextField = ({
  id,
  name,
  label,
  value,
  onChange,
  control,
  required = false,
  placeholder = '',
}: MedicationTextFieldProps) => {
  if (control && name) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
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
      <Input
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MedicationTextField;
