
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
  fhirEncounterId?: string; // Added to link to FHIR encounter
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

// FHIR-compliant interfaces
export interface FHIRReference {
  reference: string;
  type?: string;
  display?: string;
}

export interface FHIRVitalSign {
  resourceType: 'Observation';
  id: string;
  status: 'final' | 'amended' | 'entered-in-error';
  code: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
    text: string;
  };
  subject: FHIRReference;
  effectiveDateTime: string;
  valueQuantity?: {
    value: number;
    unit: string;
    system: string;
    code: string;
  };
  component?: {
    code: {
      coding: {
        system: string;
        code: string;
        display: string;
      }[];
    };
    valueQuantity: {
      value: number;
      unit: string;
      system: string;
      code: string;
    };
  }[];
}

export interface AuditEvent {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, any>;
  timestamp: string;
}
