
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

interface UseMedicationFormProps {
  patientId?: string;
  onSuccess: () => void;
}

export const useMedicationForm = ({ patientId, onSuccess }: UseMedicationFormProps) => {
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

  return {
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
  };
};
