
export type OrderType = 'medication' | 'laboratory' | 'radiology' | 'procedure' | 'consultation';

export type OrderStatus = 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  type: OrderType;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  endDate?: Date;
  details: any; // Specific details based on order type
  notes?: string;
  priority: 'routine' | 'urgent' | 'stat';
  alerts?: Array<{
    type: 'warning' | 'critical' | 'info';
    message: string;
    overridden: boolean;
    overriddenBy?: string;
    overriddenReason?: string;
  }>;
}

export interface MedicationOrder {
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions: string;
  substitutionAllowed: boolean;
}

export interface LaboratoryOrder {
  tests: string[];
  frequency: string;
  clinicalReason: string;
  specimenType?: string;
  collectionInstructions?: string;
}

export interface RadiologyOrder {
  examType: string;
  bodyPart: string;
  contrast: boolean;
  clinicalReason: string;
  patientPrep?: string;
}

export interface ProcedureOrder {
  procedureName: string;
  location: string;
  scheduledTime?: Date;
  preInstructions?: string;
  postInstructions?: string;
  equipmentNeeded?: string[];
}

export interface ConsultationOrder {
  specialtyType: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'stat';
  additionalInfo?: string;
}
