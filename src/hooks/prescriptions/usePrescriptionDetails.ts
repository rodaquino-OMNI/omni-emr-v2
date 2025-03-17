
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
          patient_id: data.patientId || data.patient_id,
          provider_id: data.doctorId || data.provider_id,
          status: data.status as 'active' | 'completed' | 'cancelled',
          notes: data.notes,
          created_at: data.date || data.created_at,
          items: data.items.map(item => ({
            id: item.id,
            prescription_id: data.id,
            name: item.name,
            type: item.type as "medication" | "procedure" | "lab_test" | "imaging",
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            start_date: item.startDate || item.start_date,
            end_date: item.endDate || item.end_date,
            status: item.status,
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
