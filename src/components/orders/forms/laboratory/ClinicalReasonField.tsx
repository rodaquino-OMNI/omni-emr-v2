
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

interface ClinicalReasonFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const ClinicalReasonField = ({ value, onChange }: ClinicalReasonFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1.5">
      <Label htmlFor="clinical-reason">
        {language === 'pt' ? 'Razão Clínica' : 'Clinical Reason'}
      </Label>
      <Textarea
        id="clinical-reason"
        placeholder={language === 'pt' 
          ? 'Descreva a razão clínica para estes exames...' 
          : 'Describe the clinical reason for these tests...'
        }
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default ClinicalReasonField;
