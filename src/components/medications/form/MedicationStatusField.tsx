
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '@/components/ui/label';

interface MedicationStatusFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const MedicationStatusField = ({
  id,
  value,
  onChange,
}: MedicationStatusFieldProps) => {
  const { language } = useTranslation();
  
  // FHIR-compliant medication request statuses
  // http://hl7.org/fhir/R4/valueset-medicationrequest-status.html
  const statuses = [
    { value: 'active', label: language === 'pt' ? 'Ativo' : 'Active' },
    { value: 'on-hold', label: language === 'pt' ? 'Em Espera' : 'On Hold' },
    { value: 'cancelled', label: language === 'pt' ? 'Cancelado' : 'Cancelled' },
    { value: 'completed', label: language === 'pt' ? 'Completado' : 'Completed' },
    { value: 'entered-in-error', label: language === 'pt' ? 'Inserido por Erro' : 'Entered in Error' },
    { value: 'stopped', label: language === 'pt' ? 'Interrompido' : 'Stopped' },
    { value: 'draft', label: language === 'pt' ? 'Rascunho' : 'Draft' },
    { value: 'unknown', label: language === 'pt' ? 'Desconhecido' : 'Unknown' },
  ];
  
  return (
    <div>
      <Label htmlFor={id}>
        {language === 'pt' ? 'Status' : 'Status'}
      </Label>
      <select
        id={id}
        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-background"
        value={value}
        onChange={onChange}
        required
      >
        {statuses.map((statusOption) => (
          <option key={statusOption.value} value={statusOption.value}>
            {statusOption.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MedicationStatusField;
