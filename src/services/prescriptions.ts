
// Prescriptions service module

import { Prescription } from "../components/prescriptions";

// Mock data for demonstration
const mockPrescriptions = [
  {
    id: '1',
    patientId: '101',
    patientName: 'John Doe',
    doctorId: '201',
    doctorName: 'Dr. Sarah Chen',
    date: '2023-11-15T08:30:00.000Z',
    status: 'active',
    items: [
      {
        id: '1001',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        status: 'active'
      },
      {
        id: '1002',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '30 days',
        status: 'active'
      }
    ]
  },
  {
    id: '2',
    patientId: '102',
    patientName: 'Jane Smith',
    doctorId: '201',
    doctorName: 'Dr. Sarah Chen',
    date: '2023-11-10T10:15:00.000Z',
    status: 'completed',
    items: [
      {
        id: '1003',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '10 days',
        status: 'completed'
      }
    ]
  },
  {
    id: '3',
    patientId: '103',
    patientName: 'Robert Johnson',
    doctorId: '202',
    doctorName: 'Dr. Michael Rodriguez',
    date: '2023-11-12T14:45:00.000Z',
    status: 'cancelled',
    items: [
      {
        id: '1004',
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'As needed',
        duration: '7 days',
        status: 'cancelled'
      }
    ]
  }
];

/**
 * Get all prescriptions for a doctor
 */
export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
  // In a real application, this would be an API call
  // const { data, error } = await supabase
  //  .from('prescriptions')
  //  .select('*')
  //  .eq('doctor_id', doctorId);
  
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const filteredPrescriptions = mockPrescriptions.filter(p => p.doctorId === doctorId);
      resolve(filteredPrescriptions.length > 0 ? filteredPrescriptions : mockPrescriptions);
    }, 500);
  });
};

/**
 * Get all prescriptions for a patient
 */
export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  // In a real application, this would be an API call
  // const { data, error } = await supabase
  //  .from('prescriptions')
  //  .select('*')
  //  .eq('patient_id', patientId);
  
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const filteredPrescriptions = mockPrescriptions.filter(p => p.patientId === patientId);
      resolve(filteredPrescriptions);
    }, 500);
  });
};

/**
 * Get a single prescription by ID
 */
export const getPrescriptionById = async (id: string): Promise<Prescription | null> => {
  // In a real application, this would be an API call
  // const { data, error } = await supabase
  //  .from('prescriptions')
  //  .select('*')
  //  .eq('id', id)
  //  .single();
  
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const foundPrescription = mockPrescriptions.find(p => p.id === id);
      resolve(foundPrescription || null);
    }, 500);
  });
};

/**
 * Create a new prescription
 */
export const createPrescription = async (prescription: Partial<Prescription>): Promise<Prescription> => {
  // In a real application, this would be an API call
  // const { data, error } = await supabase
  //  .from('prescriptions')
  //  .insert(prescription)
  //  .single();
  
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const newPrescription = {
        id: `new-${Date.now()}`,
        date: new Date().toISOString(),
        ...prescription
      } as Prescription;
      
      resolve(newPrescription);
    }, 500);
  });
};

/**
 * Update a prescription
 */
export const updatePrescription = async (id: string, updates: Partial<Prescription>): Promise<Prescription | null> => {
  // In a real application, this would be an API call
  // const { data, error } = await supabase
  //  .from('prescriptions')
  //  .update(updates)
  //  .eq('id', id)
  //  .single();
  
  // Simulate API call delay
  return new Promise(resolve => {
    setTimeout(() => {
      const foundIndex = mockPrescriptions.findIndex(p => p.id === id);
      if (foundIndex !== -1) {
        const updatedPrescription = {
          ...mockPrescriptions[foundIndex],
          ...updates
        };
        mockPrescriptions[foundIndex] = updatedPrescription;
        resolve(updatedPrescription);
      } else {
        resolve(null);
      }
    }, 500);
  });
};
