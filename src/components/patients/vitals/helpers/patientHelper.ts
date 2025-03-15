
import { MOCK_PATIENTS } from '@/pages/VitalSigns';

export const getPatientName = (patientId: string): string => {
  // Try to find the patient in the MOCK_PATIENTS array
  try {
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    if (patient) {
      return patient.name;
    }
  } catch (error) {
    console.error('Error getting patient name:', error);
  }
  
  // Fallback if patient not found
  return `Patient ID: ${patientId}`;
};
