
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';

interface ScheduleDateFieldProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const ScheduleDateField = ({ value, onChange }: ScheduleDateFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-1.5">
      <Label>
        {language === 'pt' ? 'Data e Hora Programadas' : 'Scheduled Date and Time'}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : (language === 'pt' ? 'Selecionar data' : 'Select date')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ScheduleDateField;
