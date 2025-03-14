
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/hooks/useTranslation';

interface PrioritySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PrioritySelector = ({ value, onChange }: PrioritySelectorProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1.5">
      <Label>
        {language === 'pt' ? 'Prioridade' : 'Priority'}
      </Label>
      <RadioGroup 
        value={value}
        onValueChange={onChange}
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="routine" id="priority-routine" />
            <Label htmlFor="priority-routine">
              {language === 'pt' ? 'Rotina' : 'Routine'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="urgent" id="priority-urgent" />
            <Label htmlFor="priority-urgent">
              {language === 'pt' ? 'Urgente' : 'Urgent'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="stat" id="priority-stat" />
            <Label htmlFor="priority-stat">
              {language === 'pt' ? 'Imediato' : 'STAT'}
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PrioritySelector;
