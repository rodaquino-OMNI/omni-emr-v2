
export type OrderType = 'medication' | 'laboratory' | 'radiology' | 'consultation' | 'procedure';
export type OrderPriority = 'routine' | 'urgent' | 'stat';
export type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'on-hold' | 'approved';

export interface Order {
  id: string;
  patientId: string;
  doctorId: string;
  providerName?: string;
  orderType: OrderType;
  type?: OrderType; // For backward compatibility
  priority: OrderPriority;
  status: OrderStatus;
  orderDate: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  details?: any; // For storing order-specific details
  alerts?: any[];
}

export interface MedicationOrder extends Order {
  orderType: 'medication';
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  duration?: string;
  instructions?: string;
  substitutionAllowed?: boolean;
  rxNormCode?: string;
}

export interface LaboratoryOrder extends Order {
  orderType: 'laboratory';
  tests: string[];
  frequency: string;
  clinicalReason: string;
  specimenType?: string;
  collectionInstructions?: string;
}

export interface RadiologyOrder extends Order {
  orderType: 'radiology';
  examType: string;
  bodyPart: string;
  contrast: boolean;
  clinicalReason: string;
  patientPrep?: string;
}

export interface ConsultationOrder extends Order {
  orderType: 'consultation';
  specialtyType: string;
  reason: string;
  urgency: string;
  additionalInfo?: string;
}

export interface ProcedureOrder extends Order {
  orderType: 'procedure';
  procedureName: string;
  location: string;
  scheduledTime?: string;
  preInstructions?: string;
  postInstructions?: string;
  equipmentNeeded?: string[];
}

export interface PatientInsight {
  id: string;
  type: 'vital' | 'lab' | 'medication' | 'diagnosis' | 'warning' | 'info';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  date: string;
  value?: number | string;
  unit?: string;
  reference?: {
    low?: number;
    high?: number;
    normal?: number | string;
  };
  trend?: 'up' | 'down' | 'stable';
  relatedItems?: string[];
  actionRequired?: boolean;
  actionText?: string;
  actionLink?: string;
}
