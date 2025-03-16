
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { useMedicationFormState } from './useMedicationFormState';
import { useMedicationFormSubmit } from './useMedicationFormSubmit';
import { useMedicationInteractions } from './useMedicationInteractions';

interface UseMedicationFormProps {
  patientId?: string;
  onSuccess?: () => void;
}

export const useMedicationForm = (props?: UseMedicationFormProps) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const { patientId, onSuccess } = props || {};
  
  // Use dedicated hooks for form state and submission
  const { 
    formState, 
    initialValues, 
    setters 
  } = useMedicationFormState(patientId);
  
  const { submitMedication } = useMedicationFormSubmit({ 
    user, 
    language, 
    onSuccess 
  });
  
  const { 
    checkInteractions, 
    interactionsLoading 
  } = useMedicationInteractions();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitMedication(formState);
  };

  return {
    ...formState,
    ...setters,
    initialValues,
    isSubmitting: formState.isSubmitting,
    handleSubmit,
    saveMedication: submitMedication,
    checkInteractions,
    interactionsLoading
  };
};
