
// Define and export the Prescription type
export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  items: PrescriptionItem[];
  notes?: string;
}

export interface PrescriptionItem {
  id: string;
  name: string;
  type: 'medication' | 'procedure' | 'lab_test' | 'imaging';
  status: 'pending' | 'completed' | 'cancelled';
  dosage?: string;
  frequency?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  instructions?: string;
}

// Mock service functions for prescriptions
export const fetchPrescription = async (id: string): Promise<Prescription> => {
  // Mock implementation - replace with actual API call
  return {
    id,
    patientId: 'patient-123',
    patientName: 'John Doe',
    doctorId: 'doctor-456',
    doctorName: 'Dr. Smith',
    date: new Date().toISOString(),
    status: 'active',
    items: [
      {
        id: 'item-1',
        name: 'Amoxicillin',
        type: 'medication',
        status: 'pending',
        dosage: '500mg',
        frequency: 'Every 8 hours',
        duration: '7 days',
        instructions: 'Take with food'
      }
    ]
  };
};

export const fetchPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  // Mock implementation - replace with actual API call
  return [
    {
      id: 'prescription-1',
      patientId,
      patientName: 'John Doe',
      doctorId: 'doctor-456',
      doctorName: 'Dr. Smith',
      date: new Date().toISOString(),
      status: 'active',
      items: [
        {
          id: 'item-1',
          name: 'Amoxicillin',
          type: 'medication',
          status: 'pending',
          dosage: '500mg',
          frequency: 'Every 8 hours',
          duration: '7 days',
          instructions: 'Take with food'
        }
      ]
    }
  ];
};
