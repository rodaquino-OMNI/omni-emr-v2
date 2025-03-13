
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

interface NewMedicationFormProps {
  patientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMedicationForm = ({ patientId, onSuccess, onCancel }: NewMedicationFormProps) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');
  const [patient, setPatient] = useState(patientId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const statuses = [
    { value: 'active', label: language === 'pt' ? 'Ativo' : 'Active' },
    { value: 'discontinued', label: language === 'pt' ? 'Descontinuado' : 'Discontinued' },
    { value: 'scheduled', label: language === 'pt' ? 'Agendado' : 'Scheduled' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMedication = {
        id: Math.random().toString(36).substr(2, 9),
        patientId: patient,
        name,
        dosage,
        frequency,
        startDate: startDate.toISOString(),
        endDate: endDate?.toISOString(),
        status,
        prescribedBy: user?.name || 'Unknown Provider',
        notes
      };
      
      console.log('New medication created:', newMedication);
      
      // Success message and cleanup
      toast.success(
        language === 'pt' 
          ? 'Medicamento adicionado com sucesso' 
          : 'Medication added successfully'
      );
      onSuccess();
      
    } catch (error) {
      console.error('Error creating medication:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao adicionar medicamento' 
          : 'Error adding medication'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="name">
          {language === 'pt' ? 'Nome do Medicamento' : 'Medication Name'}
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={language === 'pt' ? 'Ex: Lisinopril' : 'Ex: Lisinopril'}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dosage">
            {language === 'pt' ? 'Dosagem' : 'Dosage'}
          </Label>
          <Input
            id="dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            required
            placeholder={language === 'pt' ? 'Ex: 10mg' : 'Ex: 10mg'}
          />
        </div>
        <div>
          <Label htmlFor="frequency">
            {language === 'pt' ? 'Frequência' : 'Frequency'}
          </Label>
          <Input
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
            placeholder={language === 'pt' ? 'Ex: Uma vez ao dia' : 'Ex: Once daily'}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>
            {language === 'pt' ? 'Data de Início' : 'Start Date'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : (language === 'pt' ? 'Selecione uma data' : 'Select a date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>
            {language === 'pt' ? 'Data de Término (opcional)' : 'End Date (optional)'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal h-10"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : (language === 'pt' ? 'Selecione uma data' : 'Select a date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                fromDate={startDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label htmlFor="status">
          {language === 'pt' ? 'Status' : 'Status'}
        </Label>
        <select
          id="status"
          className="w-full h-10 px-3 py-2 rounded-md border border-border bg-background"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          {statuses.map((statusOption) => (
            <option key={statusOption.value} value={statusOption.value}>
              {statusOption.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="notes">
          {language === 'pt' ? 'Notas e Instruções' : 'Notes and Instructions'}
        </Label>
        <Textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={language === 'pt' ? 'Instruções especiais ou notas' : 'Special instructions or notes'}
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
              {language === 'pt' ? 'Salvar Medicamento' : 'Save Medication'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default NewMedicationForm;
