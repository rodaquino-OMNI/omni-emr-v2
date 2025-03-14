
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';

interface LocationFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const LocationField = ({ value, onChange }: LocationFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1.5">
      <Label htmlFor="location">
        {language === 'pt' ? 'Local' : 'Location'}
      </Label>
      <Input
        id="location"
        placeholder={language === 'pt' ? 'Ex: Centro Cirúrgico 3' : 'Ex: Surgical Center 3'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default LocationField;
