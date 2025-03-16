
import { useState } from 'react';
import { toast } from 'sonner';

interface MedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  status: string;
  notes: string;
  patient: string;
  isSubmitting: boolean;
}

interface UseMedicationFormSubmitProps {
  user: any;
  language: string;
  onSuccess?: () => void;
}

export function useMedicationFormSubmit({
  user,
  language,
  onSuccess
}: UseMedicationFormSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Submit the medication form data
   */
  const submitMedication = async (formData: MedicationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMedication = {
        id: Math.random().toString(36).substr(2, 9),
        patientId: formData.patient,
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate?.toISOString(),
        status: formData.status,
        prescribedBy: user?.name || 'Unknown Provider',
        notes: formData.notes
      };
      
      console.log('New medication created:', newMedication);
      
      // Success message and cleanup
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
  
  /**
   * Save medication from react-hook-form data
   */
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
  
  return {
    submitMedication,
    saveMedication,
    isSubmitting
  };
}
