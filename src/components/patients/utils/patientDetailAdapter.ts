
import { Patient } from '@/types/patientTypes';
import { Patient as UnifiedPatient } from '@/types/patient';
import { AIInsight } from '@/components/ai/AIInsights';
import { AIInsight as PatientAIInsight } from '@/types/patient';
import { adaptAIInsight } from '@/utils/typeAdapters';

/**
 * Adapts a patient from patientTypes.Patient to patient.Patient format
 */
export const adaptPatientForDetail = (patient: Patient): UnifiedPatient => {
  return {
    id: patient.id,
    first_name: patient.first_name,
    last_name: patient.last_name,
    name: patient.name || `${patient.first_name} ${patient.last_name}`,
    date_of_birth: patient.date_of_birth,
    gender: patient.gender,
    mrn: patient.mrn,
    email: patient.email,
    phone: patient.phone || null,
    address: patient.address,
    city: patient.city,
    state: patient.state,
    zip_code: patient.zip_code,
    country: patient.country,
    insurance: patient.insurance,
    allergies: patient.allergies || [],
    status: patient.status,
    blood_type: patient.blood_type,
    is_assigned: patient.is_assigned,
    room_number: patient.room_number,
    emergency_contact_name: patient.emergency_contact_name,
    emergency_contact_phone: patient.emergency_contact_phone,
    age: patient.age,
    identifiers: patient.identifiers
  };
};

/**
 * Converts component AIInsights to PatientAIInsight format for PatientDetail component
 */
export const adaptInsightsForPatientDetail = (insights: AIInsight[]): PatientAIInsight[] => {
  return insights.map(adaptAIInsight);
};
