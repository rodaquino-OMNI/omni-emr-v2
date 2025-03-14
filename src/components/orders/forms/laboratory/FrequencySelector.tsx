
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/hooks/useTranslation';

interface FrequencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FrequencySelector = ({ value, onChange }: FrequencySelectorProps) => {
  const { language } = useTranslation();
  
  const frequencyOptions = [
    { value: 'once', label: language === 'pt' ? 'Uma vez' : 'Once' },
    { value: 'daily', label: language === 'pt' ? 'Diariamente' : 'Daily' },
    { value: 'weekly', label: language === 'pt' ? 'Semanalmente' : 'Weekly' },
    { value: 'monthly', label: language === 'pt' ? 'Mensalmente' : 'Monthly' }
  ];
  
  return (
    <div className="space-y-1.5">
      <Label>
        {language === 'pt' ? 'Frequência' : 'Frequency'}
      </Label>
      <RadioGroup 
        value={value}
        onValueChange={onChange}
        className="flex flex-wrap gap-4"
      >
        {frequencyOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`frequency-${option.value}`} />
            <Label htmlFor={`frequency-${option.value}`}>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FrequencySelector;
