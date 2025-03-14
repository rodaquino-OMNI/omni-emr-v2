
import React from 'react';
import PatientField from './form/PatientField';
import MedicationDetailsFields from './form/MedicationDetailsFields';
import MedicationDateFields from './form/MedicationDateFields';
import MedicationStatusField from './form/MedicationStatusField';
import MedicationTextareaField from './form/MedicationTextareaField';
import MedicationFormButtons from './form/MedicationFormButtons';
import { useMedicationForm } from './hooks/useMedicationForm';
import { useTranslation } from '@/hooks/useTranslation';

interface NewMedicationFormProps {
  patientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewMedicationForm = ({ patientId, onSuccess, onCancel }: NewMedicationFormProps) => {
  const { language } = useTranslation();
  const {
    name,
    setName,
    dosage,
    setDosage,
    frequency,
    setFrequency,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
    notes,
    setNotes,
    patient,
    setPatient,
    isSubmitting,
    handleSubmit
  } = useMedicationForm({ patientId, onSuccess });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!patientId && (
        <PatientField 
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
        />
      )}

      <MedicationDetailsFields
        name={name}
        dosage={dosage}
        frequency={frequency}
        onNameChange={(e) => setName(e.target.value)}
        onDosageChange={(e) => setDosage(e.target.value)}
        onFrequencyChange={(e) => setFrequency(e.target.value)}
      />

      <MedicationDateFields
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />

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
