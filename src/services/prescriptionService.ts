
import { supabase } from "@/integrations/supabase/client";
import { User } from '@/context/AuthContext';

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

// Helper function to format a prescription for mock data
const formatPrescription = (data: any): Prescription => {
  return {
    id: data.id || crypto.randomUUID(),
    patientId: data.patientId,
    patientName: data.patientName,
    doctorId: data.doctorId,
    doctorName: data.doctorName,
    date: data.date || new Date().toISOString(),
    items: data.items || [],
    status: data.status || 'active',
    notes: data.notes
  };
};

// Mock data for prescriptions
const mockPrescriptions: Prescription[] = [
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

// Function to get all prescriptions for a patient
export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  // For now, we'll use mock data
  return mockPrescriptions.filter(p => p.patientId === patientId);
};

// Function to get all prescriptions by a doctor
export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
  // For now, we'll use mock data
  return mockPrescriptions.filter(p => p.doctorId === doctorId);
};

// Function to get a single prescription by ID
export const getPrescriptionById = async (id: string): Promise<Prescription | null> => {
  // For now, we'll use mock data
  const prescription = mockPrescriptions.find(p => p.id === id);
  return prescription || null;
};

// Function to create a new prescription
export const createPrescription = async (
  prescription: Omit<Prescription, 'id'>, 
  user: User
): Promise<Prescription> => {
  // Create a new prescription with mock data for now
  const newPrescription = formatPrescription({
    ...prescription,
    doctorId: user.id,
    doctorName: user.name,
    date: new Date().toISOString()
  });
  
  return newPrescription;
};

// Function to update a prescription
export const updatePrescription = async (
  id: string, 
  data: Partial<Prescription>
): Promise<Prescription | null> => {
  // For now, we'll use mock data
  const index = mockPrescriptions.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const updatedPrescription = {
    ...mockPrescriptions[index],
    ...data
  };
  
  return updatedPrescription;
};
