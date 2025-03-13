
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { CalendarIcon, Save } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NewRecordFormProps {
  patientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewRecordForm = ({ patientId, onSuccess, onCancel }: NewRecordFormProps) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [type, setType] = useState('lab');
  const [notes, setNotes] = useState('');
  const [patient, setPatient] = useState(patientId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const recordTypes = [
    { value: 'lab', label: language === 'pt' ? 'Resultados de Laboratório' : 'Lab Results' },
    { value: 'imaging', label: language === 'pt' ? 'Imagens' : 'Imaging' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimentos' : 'Procedures' },
    { value: 'visit', label: language === 'pt' ? 'Notas de Visita' : 'Visit Notes' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRecord = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        type,
        date,
        provider: user?.name || 'Unknown Provider',
        patientId: patient,
        notes
      };
      
      console.log('New record created:', newRecord);
      
      // Success message and cleanup
      toast.success(
        language === 'pt' 
          ? 'Registro médico criado com sucesso' 
          : 'Medical record created successfully'
      );
      onSuccess();
      
    } catch (error) {
      console.error('Error creating record:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao criar registro médico' 
          : 'Error creating medical record'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">
          {language === 'pt' ? 'Título' : 'Title'}
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={language === 'pt' ? 'Ex: Hemograma Completo' : 'Ex: Complete Blood Count'}
        />
      </div>

      <div>
        <Label htmlFor="type">
          {language === 'pt' ? 'Tipo de Registro' : 'Record Type'}
        </Label>
        <select
          id="type"
          className="w-full h-10 px-3 py-2 rounded-md border border-border bg-background"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          {recordTypes.map((recordType) => (
            <option key={recordType.value} value={recordType.value}>
              {recordType.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>
          {language === 'pt' ? 'Data' : 'Date'}
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal h-10"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : (language === 'pt' ? 'Selecione uma data' : 'Select a date')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {!patientId && (
        <div>
          <Label htmlFor="patient">
            {language === 'pt' ? 'ID do Paciente' : 'Patient ID'}
          </Label>
          <Input
            id="patient"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            required={!patientId}
            placeholder={language === 'pt' ? 'Digite o ID do paciente' : 'Enter patient ID'}
          />
        </div>
      )}

      <div>
        <Label htmlFor="notes">
          {language === 'pt' ? 'Notas e Observações' : 'Notes and Observations'}
        </Label>
        <Textarea
          id="notes"
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={language === 'pt' ? 'Detalhes do registro médico' : 'Medical record details'}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {language === 'pt' ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-1"
        >
          {isSubmitting ? (
            language === 'pt' ? 'Salvando...' : 'Saving...'
          ) : (
            <>
              <Save className="h-4 w-4" />
              {language === 'pt' ? 'Salvar Registro' : 'Save Record'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default NewRecordForm;
