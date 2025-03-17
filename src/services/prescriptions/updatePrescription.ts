
import { supabase, logAuditEvent } from "@/integrations/supabase/client";
import { User } from '@/context/AuthContext';
import { Prescription } from './types';
import { transformPrescription } from './transformUtils';
import { handleDatabaseError, handleTransactionError } from '@/utils/errorHandling';
import { mockPrescriptions } from './mockData';

/**
 * Updates an existing prescription
 */
export const updatePrescription = async (
  id: string, 
  data: Partial<Prescription>,
  user: User
): Promise<Prescription | null> => {
  try {
    // Update prescription
    const { data: updatedPrescription, error } = await supabase
      .from('prescriptions')
      .update({
        status: data.status,
        notes: data.notes
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw handleDatabaseError(error, 'update', 'prescription');
    }

    // Update prescription items if provided
    if (data.items && data.items.length > 0) {
      await updatePrescriptionItems(id, data.items);
    }

    // Log the prescription update in audit log
    await logAuditEvent(
      user.id,
      'update',
      'prescription',
      id,
      { changes: JSON.stringify(data) }
    );

    return await transformPrescription(updatedPrescription);
  } catch (error) {
    console.error('Error in updatePrescription:', error);
    
    // For fallback/development, use mock data
    return updateMockPrescription(id, data);
  }
};

/**
 * Helper function to update prescription items
 */
const updatePrescriptionItems = async (prescriptionId: string, items: any[]) => {
  // First, delete existing items
  const { error: deleteError } = await supabase
    .from('prescription_items')
    .delete()
    .eq('prescription_id', prescriptionId);
    
  if (deleteError) {
    throw handleDatabaseError(deleteError, 'delete', 'prescription items');
  }

  // Then insert new items
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

  const { error: insertError } = await supabase
    .from('prescription_items')
    .insert(prescriptionItems);
    
  if (insertError) {
    throw handleDatabaseError(insertError, 'insert', 'prescription items');
  }
};

/**
 * Updates a mock prescription for fallback/development
 */
const updateMockPrescription = (id: string, data: Partial<Prescription>): Prescription | null => {
  const index = mockPrescriptions.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const updatedPrescription = {
    ...mockPrescriptions[index],
    ...data
  };
  
  return updatedPrescription;
};

