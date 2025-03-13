
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MedicationTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}

const MedicationTextField = ({
  id,
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
}: MedicationTextFieldProps) => {
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
