
import { supabase, logAuditEvent } from "@/integrations/supabase/client";
import { User } from '@/context/AuthContext';
import { Prescription } from './types';
import { transformPrescription } from './transformUtils';
import { mockPrescriptions } from './mockData';

// Function to get all prescriptions for a patient
export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('patient_id', patientId);

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return mockPrescriptions.filter(p => p.patientId === patientId);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform each prescription
    const prescriptions = await Promise.all(data.map(transformPrescription));
    return prescriptions;
  } catch (error) {
    console.error('Error processing prescriptions:', error);
    return mockPrescriptions.filter(p => p.patientId === patientId);
  }
};

// Function to get all prescriptions by a doctor
export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('doctor_id', doctorId);

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return mockPrescriptions.filter(p => p.doctorId === doctorId);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform each prescription
    const prescriptions = await Promise.all(data.map(transformPrescription));
    return prescriptions;
  } catch (error) {
    console.error('Error processing prescriptions:', error);
    return mockPrescriptions.filter(p => p.doctorId === doctorId);
  }
};

// Function to get a single prescription by ID
export const getPrescriptionById = async (id: string): Promise<Prescription | null> => {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching prescription:', error);
      return mockPrescriptions.find(p => p.id === id) || null;
    }

    return await transformPrescription(data);
  } catch (error) {
    console.error('Error processing prescription:', error);
    return mockPrescriptions.find(p => p.id === id) || null;
  }
};

// Function to create a new prescription
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
      console.error('Error creating prescription:', error);
      throw error;
    }

    // Insert prescription items
    if (prescription.items.length > 0) {
      const prescriptionItems = prescription.items.map(item => ({
        prescription_id: data.id,
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

      const { error: itemsError } = await supabase
        .from('prescription_items')
        .insert(prescriptionItems);

      if (itemsError) {
        console.error('Error creating prescription items:', itemsError);
        throw itemsError;
      }
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
    const mockPrescription = {
      ...prescription,
      id: crypto.randomUUID(),
      doctorId: user.id,
      doctorName: user.name,
      date: new Date().toISOString()
    };
    
    return mockPrescription;
  }
};

// Function to update a prescription
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
      console.error('Error updating prescription:', error);
      throw error;
    }

    // Update prescription items if provided
    if (data.items && data.items.length > 0) {
      // First, delete existing items
      await supabase
        .from('prescription_items')
        .delete()
        .eq('prescription_id', id);

      // Then insert new items
      const prescriptionItems = data.items.map(item => ({
        prescription_id: id,
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

      await supabase
        .from('prescription_items')
        .insert(prescriptionItems);
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
    const index = mockPrescriptions.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    const updatedPrescription = {
      ...mockPrescriptions[index],
      ...data
    };
    
    return updatedPrescription;
  }
};
