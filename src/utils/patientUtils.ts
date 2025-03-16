
import { Patient, PatientStatus } from '@/types/patientTypes';
import { convertToPatientStatus } from '@/utils/patientStatusUtils';

/**
 * Safely processes patient data from various sources and ensures it conforms to the Patient type
 * @param rawPatientData Raw patient data from any source (database, API, etc.)
 * @returns A properly formatted Patient object with correct types
 */
export const processPatientData = (rawPatientData: any): Patient | null => {
  if (!rawPatientData) return null;
  
  try {
    // Ensure all required fields are present
    if (!rawPatientData.id || !rawPatientData.first_name || !rawPatientData.last_name || !rawPatientData.date_of_birth) {
      console.error('Missing required patient data fields:', rawPatientData);
      return null;
    }
    
    // Create properly typed patient object
    const patient: Patient = {
      id: rawPatientData.id,
      first_name: rawPatientData.first_name,
      last_name: rawPatientData.last_name,
      date_of_birth: rawPatientData.date_of_birth,
      gender: rawPatientData.gender || null,
      mrn: rawPatientData.mrn || '',
      // Ensure status is a valid PatientStatus
      status: convertToPatientStatus(rawPatientData.status),
      // Optional fields
      is_assigned: rawPatientData.is_assigned ?? false,
      room_number: rawPatientData.room_number || null,
      // Calculated fields if available
      name: rawPatientData.name || `${rawPatientData.first_name} ${rawPatientData.last_name}`,
      age: rawPatientData.age || calculatePatientAge(rawPatientData.date_of_birth),
      diagnosis: rawPatientData.diagnosis || null
    };
    
    return patient;
  } catch (error) {
    console.error('Error processing patient data:', error);
    return null;
  }
};

/**
 * Calculate patient age from date of birth
 * @param dateOfBirth Date of birth string
 * @returns Calculated age
 */
export const calculatePatientAge = (dateOfBirth: string): number => {
  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating patient age:', error);
    return 0;
  }
};
