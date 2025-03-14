
import React, { useState } from 'react';
import OrderFormHeader from '../components/OrderFormHeader';
import PatientSelectorField from '../fields/PatientSelectorField';
import DiagnosisField from '../fields/DiagnosisField';
import NotesField from '../fields/NotesField';
import PrioritySelectField from '../fields/PrioritySelectField';
import DateRangeField from '../fields/DateRangeField';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface ModularOrderFormProps {
  onSubmit: (formData: any) => void;
  onCancel: () => void;
  initialPatientId?: string;
}

const ModularOrderForm = ({ 
  onSubmit,
  onCancel,
  initialPatientId = ''
}: ModularOrderFormProps) => {
  const { language } = useTranslation();
  const [patientId, setPatientId] = useState(initialPatientId);
  const [patientName, setPatientName] = useState('');
  const [diagnoses, setDiagnoses] = useState<string[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const handlePatientSelect = (id: string, name: string) => {
    setPatientId(id);
    setPatientName(name);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      patientId,
      patientName,
      diagnoses,
      clinicalNotes,
      priority,
      startDate,
      endDate,
      orderDate: new Date()
    };
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <OrderFormHeader
        patientId={patientId}
        diagnoses={diagnoses}
        onPatientSelect={handlePatientSelect}
        onDiagnosisChange={setDiagnoses}
      />
      
      <div className="space-y-4">
        <NotesField
          id="clinical-notes"
          value={clinicalNotes}
          onChange={setClinicalNotes}
        />
        
        <PrioritySelectField
          value={priority}
          onChange={setPriority}
        />
        
        <DateRangeField
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          startLabel={language === 'pt' ? 'Data de Início' : 'Start Date'}
          endLabel={language === 'pt' ? 'Data de Validade' : 'Valid Until'}
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {language === 'pt' ? 'Cancelar' : 'Cancel'}
        </Button>
        
        <Button type="submit">
          {language === 'pt' ? 'Salvar Pedido' : 'Save Order'}
        </Button>
      </div>
    </form>
  );
};

export default ModularOrderForm;
