
import { VisitNote } from './types';

// Mock visit notes data for development
export const mockVisitNotes: VisitNote[] = [
  {
    id: '1',
    patientId: 'p1',
    patientName: 'John Doe',
    date: '2023-05-15T10:30:00Z',
    status: 'active',
    title: 'Annual Physical',
    summary: 'Patient came in for annual physical examination. Overall health is good.',
    createdBy: 'Dr. Smith',
    createdById: 'doctor1',
    updatedAt: '2023-05-15T10:30:00Z',
    vitalSigns: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 37.0,
      oxygenSaturation: 98,
      respiratoryRate: 16,
      painLevel: 0,
      recordedAt: '2023-05-15T10:25:00Z',
      recordedBy: 'Nurse Johnson',
      recordedById: 'nurse1'
    }
  },
  {
    id: '2',
    patientId: 'p2',
    patientName: 'Jane Smith',
    date: '2023-05-14T14:15:00Z',
    status: 'discharged',
    title: 'Follow-up Appointment',
    summary: 'Follow-up after antibiotics course. Infection has cleared up.',
    createdBy: 'Dr. Miller',
    createdById: 'doctor2',
    updatedAt: '2023-05-14T14:15:00Z',
    vitalSigns: {
      heartRate: 68,
      bloodPressure: '118/76',
      temperature: 36.8,
      oxygenSaturation: 99,
      respiratoryRate: 14,
      painLevel: 1,
      recordedAt: '2023-05-14T14:10:00Z',
      recordedBy: 'Nurse Williams',
      recordedById: 'nurse2'
    }
  }
];
