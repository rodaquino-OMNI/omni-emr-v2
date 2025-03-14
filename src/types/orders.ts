
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
  priority: 'routine' | 'urgent' | 'stat';
}

export interface LaboratoryOrder {
  tests: string[];
  frequency: string;
  clinicalReason: string;
  specimenType?: string;
  collectionInstructions?: string;
  priority: 'routine' | 'urgent' | 'stat';
}

export interface RadiologyOrder {
  examType: string;
  bodyPart: string;
  contrast: boolean;
  clinicalReason: string;
  patientPrep?: string;
  priority: 'routine' | 'urgent' | 'stat';
}

export interface ProcedureOrder {
  procedureName: string;
  location: string;
  scheduledTime?: Date;
  preInstructions?: string;
  postInstructions?: string;
  equipmentNeeded?: string[];
  priority: 'routine' | 'urgent' | 'stat';
}

export interface ConsultationOrder {
  specialtyType: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'stat';
  additionalInfo?: string;
  priority: 'routine' | 'urgent' | 'stat';
}
