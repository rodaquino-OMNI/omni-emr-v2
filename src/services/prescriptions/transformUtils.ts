
import { supabase } from "@/integrations/supabase/client";
import { Prescription, PrescriptionItem } from './types';

// Helper function to transform Supabase prescription data to our app format
export const transformPrescription = async (prescription: any): Promise<Prescription> => {
  // Fetch patient name from profiles
  const { data: patientData } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', prescription.patient_id)
    .single();

  // Fetch doctor name from profiles  
  const { data: doctorData } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', prescription.doctor_id)
    .single();

  // Fetch prescription items
  const { data: items } = await supabase
    .from('prescription_items')
    .select('*')
    .eq('prescription_id', prescription.id);

  // Transform prescription items format with proper type casting
  const transformedItems: PrescriptionItem[] = items ? items.map(item => ({
    id: item.id,
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
    startDate: item.start_date,
    endDate: item.end_date,
    status: item.status as 'pending' | 'completed' | 'cancelled',
    instructions: item.instructions
  })) : [];

  // Return transformed prescription
  return {
    id: prescription.id,
    patientId: prescription.patient_id,
    patientName: patientData?.name || 'Unknown Patient',
    doctorId: prescription.doctor_id,
    doctorName: doctorData?.name || 'Unknown Doctor',
    date: prescription.date,
    status: prescription.status as 'active' | 'completed' | 'cancelled',
    notes: prescription.notes,
    items: transformedItems
  };
};
