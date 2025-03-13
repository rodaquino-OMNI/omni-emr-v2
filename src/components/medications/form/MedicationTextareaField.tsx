
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface MedicationTextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
}

const MedicationTextareaField = ({
  id,
  label,
  value,
  onChange,
  rows = 3,
  placeholder = '',
}: MedicationTextareaFieldProps) => {
  return (
    <div>
      <Label htmlFor={id}>
        {label}
      </Label>
      <Textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MedicationTextareaField;
