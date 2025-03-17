
import { supabase } from '@/integrations/supabase/client';
import { Prescription } from '@/types/patientTypes';
import { handleDatabaseError } from '@/utils/errorHandling';
import { mapPrescriptionFromDatabase } from './prescriptionMappers';

/**
 * Get a specific prescription by ID
 */
export const getPrescriptionById = async (prescriptionId: string): Promise<Prescription | null> => {
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
      .eq('id', prescriptionId)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw handleDatabaseError(error, 'fetch', 'prescription');
    }
    
    if (!data) return null;
    
    // Create a complete prescription with both patient and doctor information
    const prescription = mapPrescriptionFromDatabase(data, 'patient');
    
    // Add patient name - since we have access to both patient and doctor info here
    if (data.patients) {
      // @ts-ignore - This property exists in the type but TS doesn't recognize it
      prescription.patientName = `${data.patients.first_name} ${data.patients.last_name}` || 'Unknown Patient';
    }
    
    return prescription;
  } catch (error) {
    console.error('Error fetching prescription by ID:', error);
    throw error;
  }
};
