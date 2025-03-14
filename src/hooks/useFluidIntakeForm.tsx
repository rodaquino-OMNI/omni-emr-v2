
import { useState } from 'react';
import { FluidIntakeType } from '@/utils/fluidTypes';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface UseFluidIntakeFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export const useFluidIntakeForm = ({ patientId, onSuccess }: UseFluidIntakeFormProps) => {
  const { user } = useAuth();
  const [fluidType, setFluidType] = useState<FluidIntakeType>('oral');
  const [amount, setAmount] = useState<number>(0);
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    setIsSubmitting(true);
    
    const fluidIntakeData = {
      id: uuidv4(),
      patient_id: patientId,
      timestamp: timestamp.toISOString(),
      amount,
      type: fluidType,
      notes: notes || null,
      recorded_by: user?.id || 'unknown',
      recorder_name: user?.name || 'Unknown User'
    };
    
    try {
      // Check if Supabase is connected
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error: insertError } = await supabase
        .from('fluid_intakes')
        .insert(fluidIntakeData) as { error: any };
        
      if (insertError) {
        throw insertError;
      }
      
      // Reset form
      setAmount(0);
      setNotes('');
      setTimestamp(new Date());
      
      toast.success('Fluid intake recorded successfully');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error recording fluid intake:', err);
      setError('Failed to record fluid intake. Please try again.');
      toast.error('Failed to record fluid intake');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    fluidType,
    setFluidType,
    amount,
    setAmount,
    timestamp,
    setTimestamp,
    notes,
    setNotes,
    isSubmitting,
    error,
    handleSubmit
  };
};
