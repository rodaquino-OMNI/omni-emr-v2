
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMedicalEntryFormState } from './useMedicalEntryFormState';
import { useMedicalEntrySubmit } from './useMedicalEntrySubmit';

interface UseNewEntryFormProps {
  patientId: string;
  onEntryAdded: () => void;
  onClose: () => void;
}

export const useNewEntryForm = ({ patientId, onEntryAdded, onClose }: UseNewEntryFormProps) => {
  const { user } = useAuth();
  
  // Use a dedicated hook for form state
  const { 
    title, 
    setTitle, 
    notes, 
    setNotes, 
    error, 
    setError, 
    isSubmitting, 
    setIsSubmitting 
  } = useMedicalEntryFormState();
  
  // Use a dedicated hook for form submission
  const { submitEntry } = useMedicalEntrySubmit({ 
    patientId, 
    onEntryAdded, 
    onClose, 
    setError, 
    setIsSubmitting 
  });
  
  const recorderName = user?.name || 'Unknown Provider';
  const recorderId = user?.id || 'unknown';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    
    await submitEntry({
      title,
      notes,
      recorderId,
      recorderName
    });
  };

  return {
    title,
    setTitle,
    notes,
    setNotes,
    isSubmitting,
    error,
    recorderName,
    currentDate,
    handleSubmit
  };
};
