
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { getPrescriptionById } from '@/services/prescriptions/prescriptionDetails';
import { Prescription } from '@/types/patient';

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
          patient_id: data.patientId,
          patientName: data.patientName,
          provider_id: data.doctorId,
          doctorName: data.doctorName,
          date: data.date,
          status: data.status as 'active' | 'completed' | 'cancelled',
          notes: data.notes,
          items: data.items
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
