
// Types for prescriptions
export interface Prescription {
  id: string;
  patient_id: string;
  patientName?: string;
  provider_id: string;
  doctorName?: string;
  created_at: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  items: PrescriptionItem[];
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  name: string;
  type: 'medication' | 'procedure' | 'lab_test' | 'imaging';
  details?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  start_date?: string;
  end_date?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'active';
  instructions?: string;
}
