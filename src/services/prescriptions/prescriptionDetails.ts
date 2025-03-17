
import { supabase } from '@/integrations/supabase/client';
import { Prescription } from '@/types/patientTypes';
import { handleDatabaseError } from '@/utils/errorHandling';

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
    
    // Map to Prescription type
    const prescription: Prescription = {
      id: data.id,
      patient_id: data.patient_id,
      patientName: data.patients ? `${data.patients.first_name} ${data.patients.last_name}` : 'Unknown Patient',
      provider_id: data.provider_id,
      doctorName: data.providers ? data.providers.name : 'Unknown Provider',
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      notes: data.notes,
      items: data.prescription_items.map((item: any) => ({
        id: item.id,
        prescription_id: data.id,
        name: item.name,
        type: item.type,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        start_date: item.start_date,
        end_date: item.end_date,
        status: item.status,
        instructions: item.instructions
      }))
    };
    
    return prescription;
  } catch (error) {
    console.error('Error fetching prescription by ID:', error);
    throw error;
  }
};
