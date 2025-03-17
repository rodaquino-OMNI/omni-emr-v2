
import { supabase } from "@/integrations/supabase/client";
import { Prescription, PrescriptionItem } from './types';

// Helper function to transform Supabase prescription data to our app format
export const transformPrescription = async (prescription: any): Promise<Prescription> => {
  if (!prescription) {
    throw new Error("Cannot transform undefined or null prescription");
  }

  // Fetch patient name from profiles
  const patientResponse = await supabase
    .from('profiles')
    .select('name')
    .eq('id', prescription.patient_id)
    .maybeSingle();

  const patientName = patientResponse?.data?.name || 'Unknown Patient';

  // Fetch doctor name from profiles  
  const doctorResponse = await supabase
    .from('profiles')
    .select('name')
    .eq('id', prescription.doctor_id)
    .maybeSingle();

  const doctorName = doctorResponse?.data?.name || 'Unknown Doctor';

  // Fetch prescription items
  const itemsResponse = await supabase
    .from('prescription_items')
    .select('*')
    .eq('prescription_id', prescription.id);

  const items = itemsResponse?.data || [];

  // Transform prescription items format with proper type casting
  const transformedItems: PrescriptionItem[] = items ? items.map(item => ({
    id: item.id,
    prescription_id: prescription.id,
    name: item.name,
    // Ensure the type is one of the allowed values
    type: (item.type === 'medication' || item.type === 'procedure' || 
          item.type === 'lab_test' || item.type === 'imaging') 
          ? (item.type as 'medication' | 'procedure' | 'lab_test' | 'imaging')
          : 'medication', // Default fallback
    details: item.details,
    dosage: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
    start_date: item.start_date,
    end_date: item.end_date,
    status: item.status as 'pending' | 'completed' | 'cancelled',
    instructions: item.instructions
  })) : [];

  // Return transformed prescription
  return {
    id: prescription.id,
    patient_id: prescription.patient_id,
    patientName: patientName,
    provider_id: prescription.doctor_id,
    doctorName: doctorName,
    created_at: prescription.date || prescription.created_at,
    status: prescription.status as 'active' | 'completed' | 'cancelled',
    notes: prescription.notes,
    items: transformedItems
  };
};
