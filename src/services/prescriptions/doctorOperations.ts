
import { supabase } from '@/integrations/supabase/client';
import { Prescription } from '@/types/patientTypes';
import { handleDatabaseError } from '@/utils/errorHandling';
import { mapPrescriptionFromDatabase } from './prescriptionMappers';

/**
 * Get prescriptions for a specific doctor
 */
export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
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
        patients:patient_id (first_name, last_name),
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
      .eq('provider_id', doctorId)
      .order('created_at', { ascending: false });
      
    if (error) throw handleDatabaseError(error);
    
    // Map to Prescription type using the shared mapper
    return data.map((prescription: any) => 
      mapPrescriptionFromDatabase(prescription, 'doctor')
    );
  } catch (error) {
    console.error('Error fetching doctor prescriptions:', error);
    throw error;
  }
};
