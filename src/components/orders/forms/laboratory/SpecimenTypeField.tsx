
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';

interface SpecimenTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const SpecimenTypeField = ({ value, onChange }: SpecimenTypeFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1.5">
      <Label htmlFor="specimen-type">
        {language === 'pt' ? 'Tipo de Amostra' : 'Specimen Type'}
      </Label>
      <Input
        id="specimen-type"
        placeholder={language === 'pt' ? 'Ex: Sangue, Urina' : 'Ex: Blood, Urine'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SpecimenTypeField;
