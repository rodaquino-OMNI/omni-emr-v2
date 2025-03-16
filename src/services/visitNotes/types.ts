
export interface VisitNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  status: 'active' | 'discharged';
  title: string;
  summary: string;
  createdBy?: string;
  createdById?: string;
  updatedAt?: string;
  vitalSigns?: VitalSigns;
}

export interface VitalSigns {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  painLevel?: number;
  recordedAt?: string;
  recordedBy?: string;
  recordedById?: string;
}
