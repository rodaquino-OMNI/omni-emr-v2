
import { useState } from 'react';

export const useMedicalEntryFormState = () => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resetForm = () => {
    setTitle('');
    setNotes('');
    setError(null);
  };
  
  return {
    title,
    setTitle,
    notes,
    setNotes,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    resetForm
  };
};
