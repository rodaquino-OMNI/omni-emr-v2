
import { Prescription, PrescriptionItem } from '@/types/patientTypes';

/**
 * Maps a prescription from the database structure to the application's Prescription type
 * @param prescription The raw prescription data from Supabase
 * @param viewContext Whether this is being viewed in the context of a patient or doctor
 */
export const mapPrescriptionFromDatabase = (
  prescription: any, 
  viewContext: 'patient' | 'doctor'
): Prescription => {
  // Map the prescription items
  const items: PrescriptionItem[] = prescription.prescription_items.map((item: any) => ({
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
  }));

  // Create the base prescription object
  const mappedPrescription: Prescription = {
    id: prescription.id,
    patient_id: prescription.patient_id,
    provider_id: prescription.provider_id,
    status: prescription.status,
    created_at: prescription.created_at,
    updated_at: prescription.updated_at,
    notes: prescription.notes,
    items: items
  };

  // Add context-specific fields
  if (viewContext === 'patient') {
    mappedPrescription.doctorName = prescription.providers ? prescription.providers.name : 'Unknown Provider';
  } else if (viewContext === 'doctor') {
    mappedPrescription.patientName = prescription.patients ? 
      `${prescription.patients.first_name} ${prescription.patients.last_name}` : 
      'Unknown Patient';
  }

  return mappedPrescription;
};

/**
 * Prepares prescription data for saving to the database
 * @param prescription The prescription data to prepare
 * @returns Object with prescription and items data ready for database insertion
 */
export const preparePrescriptionForDatabase = (prescription: Prescription) => {
  // Extract the items to be inserted separately
  const items = prescription.items.map(item => ({
    prescription_id: prescription.id, // Will be set for new items after prescription is created
    name: item.name,
    type: item.type,
    dosage: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
    start_date: item.start_date,
    end_date: item.end_date,
    status: item.status || 'active',
    instructions: item.instructions
  }));

  // Prepare the prescription record
  const prescriptionRecord = {
    patient_id: prescription.patient_id,
    provider_id: prescription.provider_id,
    status: prescription.status || 'active',
    notes: prescription.notes,
  };

  return {
    prescription: prescriptionRecord,
    items
  };
};
