
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Prescription, PrescriptionItem } from '@/types/patient';

interface FormattedPrescription {
  id: string;
  patientId: string;
  doctorId: string;
  status: string;
  date: string;
  notes?: string;
  items: Array<{
    id: string;
    name: string;
    type: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    startDate?: string;
    endDate?: string;
    instructions?: string;
    status: string;
  }>;
}

export const usePrescriptionDetails = (prescriptionId?: string) => {
  const [prescription, setPrescription] = useState<FormattedPrescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prescriptionId) {
      setLoading(false);
      return;
    }

    const fetchPrescriptionDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the prescription details
        const { data: prescriptionData, error: prescriptionError } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('id', prescriptionId)
          .single();

        if (prescriptionError) {
          throw prescriptionError;
        }

        // Fetch the prescription items
        const { data: itemsData, error: itemsError } = await supabase
          .from('prescription_items')
          .select('*')
          .eq('prescription_id', prescriptionId);

        if (itemsError) {
          throw itemsError;
        }

        // Format the data to match the expected structure
        const formattedPrescription: FormattedPrescription = {
          id: prescriptionData.id,
          patientId: prescriptionData.patient_id,
          doctorId: prescriptionData.doctor_id || "",
          status: prescriptionData.status,
          date: prescriptionData.created_at || new Date().toISOString(),
          notes: prescriptionData.notes,
          items: itemsData.map((item: PrescriptionItem) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            dosage: item.dosage,
            frequency: item.frequency,
            duration: item.duration,
            startDate: item.start_date,
            endDate: item.end_date,
            instructions: item.instructions,
            status: item.status
          }))
        };

        setPrescription(formattedPrescription);
      } catch (err: any) {
        console.error('Error fetching prescription details:', err);
        setError(err.message || 'Failed to fetch prescription details');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionDetails();
  }, [prescriptionId]);

  return { prescription, loading, error };
};

export default usePrescriptionDetails;
