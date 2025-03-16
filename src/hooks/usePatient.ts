
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Patient, PatientStatus, mapToPatientStatus } from '@/types/patientTypes';

export function usePatient() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          // Map string status to enum
          const patientWithStatusEnum: Patient = {
            ...data,
            status: mapToPatientStatus(data.status as string),
            name: `${data.first_name} ${data.last_name}`
          };
          
          setPatient(patientWithStatusEnum);
        }
      } catch (err: any) {
        console.error('Error fetching patient:', err);
        setError(err.message || 'An error occurred while fetching patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  return { patient, loading, error };
}
