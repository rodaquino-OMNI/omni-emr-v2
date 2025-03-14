
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';

interface NotesFieldProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const NotesField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  placeholder,
  rows = 3
}: NotesFieldProps) => {
  const { language } = useTranslation();
  
  const defaultLabel = language === 'pt' ? 'Notas Clínicas' : 'Clinical Notes';
  const defaultPlaceholder = language === 'pt' 
    ? 'Adicione informações relevantes para este pedido...' 
    : 'Add relevant information for this order...';
  
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label || defaultLabel}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder || defaultPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
    </div>
  );
};

export default NotesField;
