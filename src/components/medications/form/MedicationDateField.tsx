
import React from 'react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from '@/components/ui/label';

interface MedicationDateFieldProps {
  label: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  fromDate?: Date;
  optional?: boolean;
}

const MedicationDateField = ({ 
  label, 
  value, 
  onChange, 
  fromDate, 
  optional = false 
}: MedicationDateFieldProps) => {
  const { language } = useTranslation();
  
  return (
    <div>
      <Label>
        {label} {optional && language === 'pt' ? '(opcional)' : optional ? '(optional)' : ''}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-10"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, 'PPP') : (language === 'pt' ? 'Selecione uma data' : 'Select a date')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            fromDate={fromDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MedicationDateField;
