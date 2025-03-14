
import { Prescription } from './types';

// Mock data for prescriptions when offline or for development
export const mockPrescriptions: Prescription[] = [
  {
    id: "101",
    patientId: "1",
    patientName: "John Doe",
    doctorId: "2",
    doctorName: "Dr. Sarah Chen",
    date: "2023-11-20T10:30:00Z",
    status: "active",
    notes: "Follow up in 2 weeks",
    items: [
      {
        id: "1001",
        name: "Amoxicillin",
        type: "medication",
        dosage: "500mg",
        frequency: "Three times daily",
        duration: "10 days",
        startDate: "2023-11-20",
        status: "pending",
        instructions: "Take with food"
      },
      {
        id: "1002",
        name: "Complete Blood Count",
        type: "lab_test",
        status: "pending",
        instructions: "Fasting for 8 hours"
      }
    ]
  },
  {
    id: "102",
    patientId: "3",
    patientName: "Michael Johnson",
    doctorId: "2",
    doctorName: "Dr. Sarah Chen",
    date: "2023-11-15T14:00:00Z",
    status: "active",
    items: [
      {
        id: "1003",
        name: "Chest X-Ray",
        type: "imaging",
        status: "completed",
        instructions: "Standard views"
      },
      {
        id: "1004",
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
