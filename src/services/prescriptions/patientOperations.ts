
import { supabase } from '@/integrations/supabase/client';
import { Prescription } from '@/types/patientTypes';

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
      
    if (error) throw error;
    
    // Map to Prescription type
    const prescriptions = data.map((prescription: any) => {
      return {
        id: prescription.id,
        patient_id: prescription.patient_id,
        provider_id: prescription.provider_id,
        doctorName: prescription.providers ? prescription.providers.name : 'Unknown Provider',
        status: prescription.status,
        created_at: prescription.created_at,
        updated_at: prescription.updated_at,
        notes: prescription.notes,
        items: prescription.prescription_items.map((item: any) => ({
          id: item.id,
          prescription_id: prescription.id,
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
    });
    
    return prescriptions;
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    throw error;
  }
};
