
import { supabase } from '@/integrations/supabase/client';
import { Prescription } from '@/types/patientTypes';
import { handleDatabaseError } from '@/utils/errorHandling';
import { mapPrescriptionFromDatabase } from './prescriptionMappers';

/**
 * Get prescriptions for a specific patient
 */
export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        id,
        patient_id,
        provider_id,
        status,
        notes,
        created_at,
        updated_at,
        providers:provider_id (name),
        prescription_items (
          id,
          name,
          type,
          dosage,
          frequency,
          duration,
          start_date,
          end_date,
          status,
          instructions
        )
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
      
    if (error) throw handleDatabaseError(error);
    
    // Map to Prescription type using the shared mapper
    return data.map((prescription: any) => 
      mapPrescriptionFromDatabase(prescription, 'patient')
    );
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    throw error;
  }
};
