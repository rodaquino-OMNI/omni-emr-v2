
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';

interface ProcedureNameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ProcedureNameField = ({ value, onChange }: ProcedureNameFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1.5">
      <Label htmlFor="procedure-name">
        {language === 'pt' ? 'Nome do Procedimento' : 'Procedure Name'}
      </Label>
      <Input
        id="procedure-name"
        placeholder={language === 'pt' ? 'Ex: Endoscopia Digestiva' : 'Ex: Digestive Endoscopy'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default ProcedureNameField;
