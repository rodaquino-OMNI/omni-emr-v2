
import { Prescription, PrescriptionItem } from './types';

// Mock data for prescriptions when offline or for development
export const mockPrescriptions: Prescription[] = [
  {
    id: "101",
    patient_id: "1",
    patientName: "John Doe",
    provider_id: "2",
    doctorName: "Dr. Sarah Chen",
    created_at: "2023-11-20T10:30:00Z",
    status: "active",
    notes: "Follow up in 2 weeks",
    items: [
      {
        id: "1001",
        prescription_id: "101",
        name: "Amoxicillin",
        type: "medication",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "10 days",
        start_date: "2023-11-20",
        status: "pending",
        instructions: "Take with food"
      },
      {
        id: "1002",
        prescription_id: "101",
        name: "Complete Blood Count",
        type: "lab_test",
        status: "pending",
        instructions: "Fasting for 8 hours"
      }
    ]
  },
  {
    id: "102",
    patient_id: "3",
    patientName: "Michael Johnson",
    provider_id: "2",
    doctorName: "Dr. Sarah Chen",
    created_at: "2023-11-15T14:00:00Z",
    status: "active",
    items: [
      {
        id: "1003",
        prescription_id: "102",
        name: "Chest X-Ray",
        type: "imaging",
        status: "completed",
        instructions: "Standard views"
      },
      {
        id: "1004",
        prescription_id: "102",
        name: "Physical Therapy",
        type: "procedure",
        frequency: "Twice weekly",
        duration: "4 weeks",
        status: "pending",
        instructions: "Focus on shoulder mobility"
      }
    ]
  }
];
