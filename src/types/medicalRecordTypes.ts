
import { Patient } from './patientTypes';

export type RecordType = 'lab' | 'imaging' | 'procedure' | 'visit' | 'discharge';

export type RecordStatus = 'completed' | 'pending' | 'cancelled';

export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  type: RecordType;
  date: string;
  provider: string;
  status: RecordStatus;
  content?: string;
  notes?: string;
}

export interface ClinicalDocumentationFormData {
  title: string;
  type: RecordType;
  patientId: string;
  content: string;
  notes?: string;
}

export interface RecordTypeOption {
  value: string;
  label: string;
}

export interface RecordFilters {
  searchTerm?: string;
  typeFilter?: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  statusFilter?: string;
}
