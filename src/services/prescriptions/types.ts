
// Types for prescriptions
export interface Prescription {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  date: string;
  items: PrescriptionItem[];
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  type: 'medication' | 'procedure' | 'lab_test' | 'imaging';
  details?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  status: 'pending' | 'completed' | 'cancelled';
  instructions?: string;
}
