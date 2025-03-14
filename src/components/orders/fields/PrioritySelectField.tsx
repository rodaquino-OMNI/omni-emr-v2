
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Clock, Zap } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PrioritySelectFieldProps {
  value: 'routine' | 'urgent' | 'stat';
  onChange: (value: 'routine' | 'urgent' | 'stat') => void;
}

const PrioritySelectField = ({ value, onChange }: PrioritySelectFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1.5">
      <Label>
        {language === 'pt' ? 'Prioridade' : 'Priority'}
      </Label>
      <RadioGroup 
        value={value}
        onValueChange={onChange as (value: string) => void}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50">
            <RadioGroupItem value="routine" id="priority-routine" />
            <Label htmlFor="priority-routine" className="flex items-center gap-2 cursor-pointer">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {language === 'pt' ? 'Rotina' : 'Routine'}
              </span>
            </Label>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50">
            <RadioGroupItem value="urgent" id="priority-urgent" />
            <Label htmlFor="priority-urgent" className="flex items-center gap-2 cursor-pointer">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>
                {language === 'pt' ? 'Urgente' : 'Urgent'}
              </span>
            </Label>
          </div>
          <div className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50">
            <RadioGroupItem value="stat" id="priority-stat" />
            <Label htmlFor="priority-stat" className="flex items-center gap-2 cursor-pointer">
              <Zap className="h-4 w-4 text-red-500" />
              <span>
                {language === 'pt' ? 'Imediato' : 'STAT'}
              </span>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PrioritySelectField;
