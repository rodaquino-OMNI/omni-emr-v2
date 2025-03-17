
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { getPrescriptionById } from '@/services/prescriptions/prescriptionDetails';
import { Prescription } from '@/services/prescriptions/types';

export const usePrescriptionDetails = (prescriptionId?: string) => {
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useTranslation();

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!prescriptionId) {
        setLoading(false);
        setError('No prescription ID provided');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getPrescriptionById(prescriptionId);
        // Convert to proper type before setting
        const typedData: Prescription = {
          id: data.id,
          patient_id: data.patient_id || data.patientId || '',
          provider_id: data.provider_id || data.doctorId || '',
          status: data.status as 'active' | 'completed' | 'cancelled',
          notes: data.notes,
          created_at: data.created_at || data.date || '',
          items: data.items.map(item => ({
            id: item.id,
            prescription_id: data.id,
            name: item.name,
            type: item.type as "medication" | "procedure" | "lab_test" | "imaging",
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            start_date: item.start_date || item.startDate || '',
            end_date: item.end_date || item.endDate || '',
            status: item.status as "pending" | "completed" | "cancelled" | "active",
            instructions: item.instructions
          }))
        };
        
        setPrescription(typedData);
      } catch (err: any) {
        console.error('Error fetching prescription details:', err);
        setError(err?.message || 'Failed to fetch prescription details');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [prescriptionId]);

  // Format date helper function
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return {
    prescription,
    loading,
    error,
    formatDate
  };
};
