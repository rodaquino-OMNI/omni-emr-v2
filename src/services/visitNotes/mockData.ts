
import { VisitNote } from './types';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development
export const mockNotes: VisitNote[] = [
  {
    id: "vn1",
    patientId: "p123",
    patientName: "John Doe",
    date: "2023-10-15",
    status: "active",
    title: "Follow-up Consultation",
    summary: "Patient is recovering well from surgery. Vital signs stable.",
    createdBy: "Dr. Smith",
    createdById: "doctor-1",
    updatedAt: "2023-10-15T14:30:00Z",
    vitalSigns: {
      heartRate: 75,
      bloodPressure: "120/80",
      temperature: 36.7,
      oxygenSaturation: 98,
      respiratoryRate: 16,
      painLevel: 1,
      recordedAt: "2023-10-15T14:20:00Z",
      recordedBy: "Dr. Smith",
      recordedById: "doctor-1"
    }
  },
  {
    id: "vn2",
    patientId: "p456",
    patientName: "Jane Smith",
    date: "2023-10-14",
    status: "active",
    title: "Initial Assessment",
    summary: "New patient with hypertension. Started on medication.",
    createdBy: "Dr. Johnson",
    createdById: "doctor-2",
    updatedAt: "2023-10-14T09:15:00Z",
    vitalSigns: {
      heartRate: 82,
      bloodPressure: "145/95",
      temperature: 36.5,
      oxygenSaturation: 97,
      respiratoryRate: 18,
      painLevel: 0,
      recordedAt: "2023-10-14T09:10:00Z",
      recordedBy: "Dr. Johnson",
      recordedById: "doctor-2"
    }
  },
  {
    id: "vn3",
    patientId: "p789",
    patientName: "Robert Johnson",
    date: "2023-09-30",
    status: "discharged",
    title: "Post-Op Check",
    summary: "Patient discharged. Recovery progressing as expected.",
    createdBy: "Dr. Wilson",
    createdById: "doctor-3",
    updatedAt: "2023-09-30T16:45:00Z",
    vitalSigns: {
      heartRate: 68,
      bloodPressure: "118/75",
      temperature: 36.9,
      oxygenSaturation: 99,
      respiratoryRate: 14,
      painLevel: 2,
      recordedAt: "2023-09-30T16:30:00Z",
      recordedBy: "Dr. Wilson",
      recordedById: "doctor-3"
    }
  }
];
