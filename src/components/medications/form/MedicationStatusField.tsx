
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '@/components/ui/label';

interface MedicationStatusFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MedicationStatusField = ({
  id,
  value,
  onChange,
}: MedicationStatusFieldProps) => {
  const { language } = useTranslation();
  
  const statuses = [
    { value: 'active', label: language === 'pt' ? 'Ativo' : 'Active' },
    { value: 'discontinued', label: language === 'pt' ? 'Descontinuado' : 'Discontinued' },
    { value: 'scheduled', label: language === 'pt' ? 'Agendado' : 'Scheduled' },
  ];
  
  return (
    <div>
      <Label htmlFor={id}>
        {language === 'pt' ? 'Status' : 'Status'}
      </Label>
      <select
        id={id}
        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-background"
        value={value}
        onChange={onChange}
        required
      >
        {statuses.map((statusOption) => (
          <option key={statusOption.value} value={statusOption.value}>
            {statusOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MedicationStatusField;
