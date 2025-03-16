
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string | null;
  mrn: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
  updated_at: string;
  room_number: string | null;
  status: string | null;
  blood_type: string | null;
}

export const usePatientData = (patientId?: string) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patient data
  const fetchPatient = useCallback(async () => {
    if (!patientId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;
      
      if (data) {
        setPatient(data as Patient);
      } else {
        setError('Patient not found');
      }
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching patient data');
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  // Update patient data
  const updatePatient = useCallback(async (updatedPatient: Partial<Patient> & { id: string }) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update({
          first_name: updatedPatient.first_name,
          last_name: updatedPatient.last_name,
          date_of_birth: updatedPatient.date_of_birth,
          gender: updatedPatient.gender,
          mrn: updatedPatient.mrn,
          email: updatedPatient.email,
          phone: updatedPatient.phone,
          address: updatedPatient.address,
          city: updatedPatient.city,
          state: updatedPatient.state,
          zip_code: updatedPatient.zip_code,
          emergency_contact_name: updatedPatient.emergency_contact_name,
          emergency_contact_phone: updatedPatient.emergency_contact_phone,
          room_number: updatedPatient.room_number,
          status: updatedPatient.status,
          blood_type: updatedPatient.blood_type,
        })
        .eq('id', updatedPatient.id)
        .select()
        .single();

      if (error) throw error;
      
      setPatient(data as Patient);
      return data;
    } catch (err) {
      console.error('Error updating patient:', err);
      throw err;
    }
  }, []);

  // Effect to fetch patient data on mount or when patientId changes
  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  return {
    patient,
    setPatient,
    isLoading,
    error,
    fetchPatient,
    updatePatient
  };
};
