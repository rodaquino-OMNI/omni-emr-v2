import { v4 as uuidv4 } from 'uuid';

export interface VisitNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  status: 'active' | 'discharged';
  title: string;
  summary: string;
  createdBy?: string;
  createdById?: string;
  updatedAt?: string;
  vitalSigns?: VitalSigns;
}

export interface VitalSigns {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  painLevel?: number;
  recordedAt?: string;
  recordedBy?: string;
  recordedById?: string;
}

// Mock data for development
const mockNotes: VisitNote[] = [
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

export const visitNoteService = {
  /**
   * Get all visit notes
   */
  getAllNotes: async (): Promise<VisitNote[]> => {
    // In a real app, this would fetch from Supabase
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockNotes]);
      }, 500);
    });
  },

  /**
   * Get a visit note by ID
   */
  getNoteById: async (id: string): Promise<VisitNote | undefined> => {
    // In a real app, this would fetch from Supabase
    // For now, search in mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const note = mockNotes.find(note => note.id === id);
        resolve(note);
      }, 300);
    });
  },

  /**
   * Create a new visit note
   */
  createNote: async (note: Omit<VisitNote, 'id' | 'updatedAt'>): Promise<VisitNote> => {
    // In a real app, this would save to Supabase
    // For now, add to mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const newNote: VisitNote = {
          ...note,
          id: uuidv4(),
          updatedAt: new Date().toISOString()
        };
        
        // In a real app, we would persist this
        mockNotes.push(newNote);
        
        resolve(newNote);
      }, 800);
    });
  },

  /**
   * Update a visit note
   */
  updateNote: async (id: string, updates: Partial<VisitNote>): Promise<VisitNote | undefined> => {
    // In a real app, this would update in Supabase
    // For now, update in mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockNotes.findIndex(note => note.id === id);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedNote: VisitNote = {
          ...mockNotes[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        // In a real app, we would persist this
        mockNotes[index] = updatedNote;
        
        resolve(updatedNote);
      }, 500);
    });
  },

  /**
   * Delete a visit note
   */
  deleteNote: async (id: string): Promise<boolean> => {
    // In a real app, this would delete from Supabase
    // For now, remove from mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockNotes.findIndex(note => note.id === id);
        
        if (index === -1) {
          resolve(false);
          return;
        }
        
        // In a real app, we would persist this
        mockNotes.splice(index, 1);
        
        resolve(true);
      }, 400);
    });
  },

  /**
   * Record vital signs for a visit note
   */
  recordVitalSigns: async (noteId: string, vitalSigns: VitalSigns): Promise<VisitNote | undefined> => {
    // In a real app, this would update in Supabase
    // For now, update in mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockNotes.findIndex(note => note.id === noteId);
        
        if (index === -1) {
          resolve(undefined);
          return;
        }
        
        const updatedNote: VisitNote = {
          ...mockNotes[index],
          vitalSigns: {
            ...vitalSigns,
            recordedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
        
        // In a real app, we would persist this
        mockNotes[index] = updatedNote;
        
        resolve(updatedNote);
      }, 500);
    });
  },

  /**
   * Get vital signs history for a patient
   */
  getPatientVitalSigns: async (patientId: string): Promise<VitalSigns[]> => {
    // In a real app, this would fetch from Supabase
    // For now, compile from mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const patientNotes = mockNotes.filter(note => note.patientId === patientId);
        const vitalSigns = patientNotes
          .filter(note => note.vitalSigns)
          .map(note => note.vitalSigns as VitalSigns)
          .sort((a, b) => {
            const dateA = a.recordedAt ? new Date(a.recordedAt).getTime() : 0;
            const dateB = b.recordedAt ? new Date(b.recordedAt).getTime() : 0;
            return dateB - dateA; // Sort in descending order (newest first)
          });
          
        resolve(vitalSigns);
      }, 300);
    });
  }
};
