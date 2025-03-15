
import { ReactNode } from 'react';

export interface PatientData {
  id: string;
  name: string;
  allergies: string[];
  roomNumber: string;
  mrn: string;
}

export interface MedicationData {
  id: string;
  medicationName: string;
  dosage: string;
  route: string;
  medicationType?: string;
}

export interface MedicationScannerProps {
  open: boolean;
  onClose: () => void;
  patient: PatientData | null;
  medication: MedicationData | null;
  onPatientScan: (id: string) => void;
  onMedicationScan: (code: string) => void;
  onVerify: () => void;
  patientScanned: boolean;
  medicationScanned: boolean;
}

export interface ScanItemProps {
  title: string;
  entity: PatientData | MedicationData | null;
  entityType: 'patient' | 'medication';
  entityName?: string;
  isScanned: boolean;
  icon: ReactNode;
}
