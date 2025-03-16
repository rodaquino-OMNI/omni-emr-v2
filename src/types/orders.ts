
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
}

export interface MedicationOrderDetails {
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions?: string;
}

export interface LaboratoryOrderDetails {
  tests: string[];
  frequency: string;
  clinicalReason?: string;
}

export interface RadiologyOrderDetails {
  examType: string;
  bodyPart: string;
  contrast: boolean;
  clinicalReason?: string;
}

export interface ProcedureOrderDetails {
  procedureName: string;
  scheduledDate?: Date;
  clinicalReason?: string;
  specialInstructions?: string;
}

export interface ConsultationOrderDetails {
  specialtyType: string;
  reason: string;
  urgency: string;
}

export interface NewOrderFormData {
  patientId: string;
  type: OrderType;
  priority: OrderPriority;
  details: any;
  notes?: string;
}
