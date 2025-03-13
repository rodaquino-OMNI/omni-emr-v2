
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import MedicationTextField from './form/MedicationTextField';
import MedicationDateField from './form/MedicationDateField';
import MedicationStatusField from './form/MedicationStatusField';
import MedicationTextareaField from './form/MedicationTextareaField';
import MedicationFormButtons from './form/MedicationFormButtons';

interface NewMedicationFormProps {
  patientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMedicationForm = ({ patientId, onSuccess, onCancel }: NewMedicationFormProps) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  
  // Form state
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');
  const [patient, setPatient] = useState(patientId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
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
        <MedicationTextField
          id="patient"
          label={language === 'pt' ? 'ID do Paciente' : 'Patient ID'}
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          required={!patientId}
          placeholder={language === 'pt' ? 'Digite o ID do paciente' : 'Enter patient ID'}
        />
      )}

      <MedicationTextField
        id="name"
        label={language === 'pt' ? 'Nome do Medicamento' : 'Medication Name'}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required={true}
        placeholder={language === 'pt' ? 'Ex: Lisinopril' : 'Ex: Lisinopril'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MedicationTextField
          id="dosage"
          label={language === 'pt' ? 'Dosagem' : 'Dosage'}
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          required={true}
          placeholder={language === 'pt' ? 'Ex: 10mg' : 'Ex: 10mg'}
        />
        
        <MedicationTextField
          id="frequency"
          label={language === 'pt' ? 'Frequência' : 'Frequency'}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          required={true}
          placeholder={language === 'pt' ? 'Ex: Uma vez ao dia' : 'Ex: Once daily'}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MedicationDateField
          label={language === 'pt' ? 'Data de Início' : 'Start Date'}
          value={startDate}
          onChange={(date) => date && setStartDate(date)}
        />
        
        <MedicationDateField
          label={language === 'pt' ? 'Data de Término' : 'End Date'}
          value={endDate}
          onChange={setEndDate}
          fromDate={startDate}
          optional={true}
        />
      </div>

      <MedicationStatusField
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />

      <MedicationTextareaField
        id="notes"
        label={language === 'pt' ? 'Notas e Instruções' : 'Notes and Instructions'}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder={language === 'pt' ? 'Instruções especiais ou notas' : 'Special instructions or notes'}
      />

      <MedicationFormButtons
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />
    </form>
  );
};

export default NewMedicationForm;
