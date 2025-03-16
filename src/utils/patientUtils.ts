
import { Patient, PatientStatus } from '@/types/patientTypes';
import { mapToPatientStatus } from '@/utils/patientStatusUtils';

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const getPatientName = (patient: Patient): string => {
  return `${patient.first_name} ${patient.last_name}`;
};

export const transformPatientData = (data: any): Patient => {
  return {
    id: data.id || '',
    first_name: data.first_name || '',
    last_name: data.last_name || '',
    date_of_birth: data.date_of_birth || '',
    gender: data.gender || null,
    mrn: data.mrn || '',
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
    city: data.city || null,
    state: data.state || null,
    zip_code: data.zip_code || null,
    status: mapToPatientStatus(data.status || ''),
    room_number: data.room_number || null,
    blood_type: data.blood_type || null,
    emergency_contact_name: data.emergency_contact_name || null,
    emergency_contact_phone: data.emergency_contact_phone || null,
    is_assigned: data.is_assigned || false
  };
};
