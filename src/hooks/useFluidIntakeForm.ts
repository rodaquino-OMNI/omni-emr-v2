
import { useState } from 'react';
import { FluidIntakeType } from '@/utils/fluidTypes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from './useTranslation';

interface UseFluidIntakeFormProps {
  patientId: string;
  onSuccess?: () => void;
}

export const useFluidIntakeForm = ({ patientId, onSuccess }: UseFluidIntakeFormProps) => {
  const { language } = useTranslation();
  const { user } = useAuth();
  const [fluidType, setFluidType] = useState<FluidIntakeType>('water');
  const [amount, setAmount] = useState<number>(0);
  const [timestamp, setTimestamp] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!user) {
        throw new Error(language === 'pt' ? 'Usuário não autenticado' : 'User not authenticated');
      }

      if (amount <= 0) {
        throw new Error(
          language === 'pt'
            ? 'A quantidade deve ser maior que zero'
            : 'Amount must be greater than zero'
        );
      }

      // Save the fluid intake record to Supabase
      const { error: supabaseError } = await supabase.from('fluid_intakes').insert({
        patient_id: patientId,
        type: fluidType,
        amount: amount,
        timestamp: timestamp.toISOString(),
        notes: notes || null,
        recorded_by: user.id
      });

      if (supabaseError) {
        throw supabaseError;
      }

      // Reset form
      setAmount(0);
      setNotes('');
      setTimestamp(new Date());
      
      // Show success message
      toast.success(
        language === 'pt' ? 'Entrada de líquido registrada' : 'Fluid intake recorded',
        {
          description: language === 'pt' 
            ? `${amount}ml de ${fluidType} registrado com sucesso` 
            : `${amount}ml of ${fluidType} successfully recorded`
        }
      );
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error recording fluid intake:', err);
      setError(err instanceof Error ? err.message : String(err));
      
      toast.error(
        language === 'pt' ? 'Erro ao registrar' : 'Error recording',
        {
          description: err instanceof Error ? err.message : String(err)
        }
      );
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
