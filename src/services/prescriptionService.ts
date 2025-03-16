
import { getDoctorPrescriptions } from './prescriptions/doctorOperations';
import { getPatientPrescriptions } from './prescriptions/patientOperations';
import { getPrescriptionById } from './prescriptions/prescriptionDetails';
import { supabase } from '@/integrations/supabase/client';

export interface PrescriptionItem {
  id: string;
  name: string;
  type: 'medication' | 'procedure' | 'lab_test' | 'imaging';
  details?: any;
  dosage?: string;
  frequency?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'completed' | 'cancelled';
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  date: string;
  items: PrescriptionItem[];
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

/**
 * Create a new prescription
 */
export const createPrescription = async (prescription: Omit<Prescription, 'id'>) => {
  try {
    // Basic validation
    if (!prescription.patientId || !prescription.doctorId || !prescription.items?.length) {
      throw new Error('Invalid prescription data');
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        patient_id: prescription.patientId,
        provider_id: prescription.doctorId,
        status: prescription.status,
        notes: prescription.notes || null,
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) throw error;
    
    const prescriptionId = data.id;
    
    // Insert prescription items
    const prescriptionItems = prescription.items.map(item => ({
      prescription_id: prescriptionId,
      name: item.name,
      type: item.type,
      dosage: item.dosage || null,
      frequency: item.frequency || null,
      duration: item.duration || null,
      start_date: item.startDate || new Date().toISOString(),
      end_date: item.endDate || null,
      status: item.status,
      instructions: item.instructions || null,
      details: item.details || null
    }));
    
    const { error: itemsError } = await supabase
      .from('prescription_items')
      .insert(prescriptionItems);
      
    if (itemsError) throw itemsError;
    
    return { id: prescriptionId, ...prescription };
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
};

/**
 * Check if there are potential drug interactions between medications
 */
export const checkDrugInteractions = async (medicationIds: string[]): Promise<any[]> => {
  try {
    if (!medicationIds || medicationIds.length < 2) {
      return [];
    }
    
    // In a real implementation, this would call an API like RxNav
    // For now, we'll return some mock data
    return [
      {
        severity: 'moderate',
        description: 'Increased risk of bleeding',
        medications: ['Aspirin', 'Warfarin']
      },
      {
        severity: 'minor',
        description: 'May decrease absorption',
        medications: ['Calcium supplements', 'Levothyroxine']
      }
    ];
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    return [];
  }
};

/**
 * Check if a medication has potential allergic reactions for a patient
 */
export const checkMedicationAllergies = async (patientId: string, medicationName: string): Promise<any[]> => {
  try {
    if (!patientId || !medicationName) {
      return [];
    }
    
    // Fetch patient allergies
    const { data: allergies, error } = await supabase
      .from('allergies')
      .select('allergen, severity, reaction')
      .eq('patient_id', patientId)
      .eq('is_active', true);
      
    if (error) throw error;
    
    if (!allergies || allergies.length === 0) {
      return [];
    }
    
    // Check for potential matches (in a real implementation, this would use 
    // a more sophisticated algorithm using medication ingredients)
    const medicationLower = medicationName.toLowerCase();
    const potentialAllergies = allergies.filter(allergy => 
      medicationLower.includes(allergy.allergen.toLowerCase())
    );
    
    return potentialAllergies;
  } catch (error) {
    console.error('Error checking medication allergies:', error);
    return [];
  }
};

export {
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getPrescriptionById
};
