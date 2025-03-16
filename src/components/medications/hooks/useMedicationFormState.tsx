
import { useState } from 'react';

export function useMedicationFormState(patientId?: string) {
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
  
  // Initial values for react-hook-form
  const initialValues = {
    rxcui: '',
    patientId: patientId || '',
    dosage: '',
    frequency: '',
    route: '',
    startDate: new Date(),
    status: 'active',
  };
  
  // Group state into an object for easier passing to submission
  const formState = {
    name,
    dosage,
    frequency,
    startDate,
    endDate,
    status,
    notes,
    patient,
    isSubmitting
  };
  
  // Group setters into an object for easier passing
  const setters = {
    setName,
    setDosage,
    setFrequency,
    setStartDate,
    setEndDate,
    setStatus,
    setNotes,
    setPatient,
    setIsSubmitting
  };
  
  return {
    formState,
    initialValues,
    setters
  };
}
