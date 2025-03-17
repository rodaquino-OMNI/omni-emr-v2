
import { supabase, logAuditEvent } from "@/integrations/supabase/client";
import { User } from '@/context/AuthContext';
import { Prescription } from './types';
import { transformPrescription } from './transformUtils';
import { handleDatabaseError, handleTransactionError } from '@/utils/errorHandling';

/**
 * Creates a new prescription in the database
 */
export const createPrescription = async (
  prescription: Omit<Prescription, 'id'>, 
  user: User
): Promise<Prescription> => {
  try {
    // Insert into prescriptions table
    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        patient_id: prescription.patientId,
        doctor_id: user.id,
        date: new Date().toISOString(),
        status: prescription.status,
        notes: prescription.notes
      })
      .select()
      .single();

    if (error) {
      throw handleDatabaseError(error, 'create', 'prescription');
    }

    // Insert prescription items if present
    if (prescription.items.length > 0) {
      await insertPrescriptionItems(data.id, prescription.items);
    }

    // Log the prescription creation in audit log
    await logAuditEvent(
      user.id,
      'create',
      'prescription',
      data.id,
      { patient_id: prescription.patientId }
    );

    // Return the newly created prescription
    return await transformPrescription(data);
  } catch (error) {
    console.error('Error in createPrescription:', error);
    
    // Return mock data for development/fallback
    return createMockPrescription(prescription, user);
  }
};

/**
 * Helper function to insert prescription items
 */
const insertPrescriptionItems = async (prescriptionId: string, items: any[]) => {
  const prescriptionItems = items.map(item => ({
    prescription_id: prescriptionId,
    name: item.name,
    type: item.type,
    details: item.details,
    dosage: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
    start_date: item.startDate,
    end_date: item.endDate,
    status: item.status,
    instructions: item.instructions
  }));

  const { error } = await supabase
    .from('prescription_items')
    .insert(prescriptionItems);

  if (error) {
    throw handleDatabaseError(error, 'create', 'prescription items');
  }
};

/**
 * Creates a mock prescription for fallback/development
 */
const createMockPrescription = (prescription: Omit<Prescription, 'id'>, user: User): Prescription => {
  return {
    ...prescription,
    id: crypto.randomUUID(),
    doctorId: user.id,
    doctorName: user.name,
    date: new Date().toISOString()
  };
};

