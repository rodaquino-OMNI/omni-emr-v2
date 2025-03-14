
import React from 'react';
import { Button } from '@/components/ui/button';
import { NoteType } from '@/types/clinicalNotes';
import { useTranslation } from '@/hooks/useTranslation';
import { templateIcons } from './TemplateIcons';

interface NoteTypeFiltersProps {
  selectedType?: NoteType;
  onTypeChange: (type: NoteType) => void;
}

const NoteTypeFilters = ({ selectedType, onTypeChange }: NoteTypeFiltersProps) => {
  const { language } = useTranslation();
  
  const noteTypes: { value: NoteType, label: string }[] = [
    { value: 'progress', label: language === 'pt' ? 'Nota de Evolução' : 'Progress Note' },
    { value: 'admission', label: language === 'pt' ? 'Nota de Admissão' : 'Admission Note' },
    { value: 'consultation', label: language === 'pt' ? 'Consulta' : 'Consultation' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimento' : 'Procedure Note' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {noteTypes.map((type) => (
        <Button
          key={type.value}
          variant={selectedType === type.value ? "default" : "outline"}
          className="flex items-center gap-2"
          onClick={() => onTypeChange(type.value)}
        >
          {templateIcons[type.value]}
          {type.label}
        </Button>
      ))}
    </div>
  );
};

export default NoteTypeFilters;
