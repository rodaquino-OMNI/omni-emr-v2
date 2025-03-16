
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import { z } from 'zod';

interface UseMedicationFormProps {
  patientId?: string;
  onSuccess?: () => void;
}

export const useMedicationForm = (props?: UseMedicationFormProps) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const { patientId, onSuccess } = props || {};
  
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
  const [interactionsLoading, setInteractionsLoading] = useState(false);
  
  // Additional properties needed by NewMedicationForm component
  const initialValues = {
    rxcui: '',
    patientId: patientId || '',
    dosage: '',
    frequency: '',
    route: '',
    startDate: new Date(),
    status: 'active',
  };
  
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
      toast.success(language === 'pt' 
        ? 'Medicamento adicionado com sucesso' 
        : 'Medication added successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error creating medication:', error);
      toast.error(language === 'pt' 
        ? 'Erro ao adicionar medicamento' 
        : 'Error adding medication');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to save medication from react-hook-form data
  const saveMedication = async (data: any, medicationName: string) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMedication = {
        ...data,
        name: medicationName,
        prescribedBy: user?.name || 'Unknown Provider',
      };
      
      console.log('New medication created with form data:', newMedication);
      
      toast.success(language === 'pt' 
        ? 'Medicamento adicionado com sucesso' 
        : 'Medication added successfully');
      
      if (onSuccess) {
        onSuccess();
      }
      
      return newMedication;
    } catch (error) {
      console.error('Error creating medication:', error);
      toast.error(language === 'pt' 
        ? 'Erro ao adicionar medicamento' 
        : 'Error adding medication');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Check interactions between medications
  const checkInteractions = async (patientId: string, rxcui: string) => {
    setInteractionsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Checking interactions for patient ${patientId} and medication ${rxcui}`);
      
      // In a real implementation, this would make an API call to check for interactions
      
      setInteractionsLoading(false);
      
      return { hasInteractions: false };
    } catch (error) {
      console.error('Error checking interactions:', error);
      setInteractionsLoading(false);
      throw error;
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
    handleSubmit,
    // New properties required by NewMedicationForm
    initialValues,
    saveMedication,
    checkInteractions,
    interactionsLoading
  };
};
