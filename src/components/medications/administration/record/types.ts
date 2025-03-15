
export interface PatientData {
  id: string;
  name: string;
  allergies: string[];
  roomNumber: string;
  mrn: string;
}

export interface AdministrationRecord {
  id: string;
  medicationName: string;
  dosage: string;
  route: string;
  scheduledTime: string;
  status: 'scheduled' | 'administered' | 'missed' | 'held';
  administeredBy?: string;
  administeredAt?: string;
  notes?: string;
  medicationType?: 'regular' | 'antibiotic' | 'analgesic' | 'critical' | 'prn';
  isIV?: boolean;
  ivRate?: number;
  ivDuration?: number;
}

export interface MedicationAdministrationRecordProps {
  patientId: string;
}
