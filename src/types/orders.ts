
export type OrderType = 'medication' | 'laboratory' | 'radiology' | 'procedure' | 'consultation';
export type OrderStatus = 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
export type OrderPriority = 'routine' | 'urgent' | 'stat';

export interface Order {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  type: OrderType;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  details: any;  // This varies based on order type
  priority: OrderPriority;
  notes?: string;
  alerts?: any[]; // Added alerts field for order alerts
}

export interface MedicationOrderDetails {
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  duration?: string;
  instructions?: string;
  substitutionAllowed?: boolean;
}

export interface LaboratoryOrderDetails {
  tests: string[];
  frequency: string;
  clinicalReason?: string;
  specimenType?: string;
  collectionInstructions?: string;
}

export interface RadiologyOrderDetails {
  examType: string;
  bodyPart: string;
  contrast: boolean;
  clinicalReason?: string;
  patientPrep?: string;
}

export interface ProcedureOrderDetails {
  procedureName: string;
  location?: string;
  scheduledTime?: Date;
  preInstructions?: string;
  postInstructions?: string;
  equipmentNeeded?: string[];
}

export interface ConsultationOrderDetails {
  specialtyType: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'stat';
  additionalInfo?: string;
}

export interface NewOrderFormData {
  patientId: string;
  type: OrderType;
  priority: OrderPriority;
  details: any;
  notes?: string;
}

// Added these interfaces to fix component errors
export interface MedicationOrder extends Order {
  details: MedicationOrderDetails;
}

export interface LaboratoryOrder extends Order {
  details: LaboratoryOrderDetails;
}

export interface RadiologyOrder extends Order {
  details: RadiologyOrderDetails;
}

export interface ProcedureOrder extends Order {
  details: ProcedureOrderDetails;
}

export interface ConsultationOrder extends Order {
  details: ConsultationOrderDetails;
}
