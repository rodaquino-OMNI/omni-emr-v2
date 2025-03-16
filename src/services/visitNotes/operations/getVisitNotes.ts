
import { VisitNote, VitalSigns } from '../types';
import { mockNotes } from '../mockData';

/**
 * Get all visit notes
 */
export const getAllNotes = async (): Promise<VisitNote[]> => {
  // In a real app, this would fetch from Supabase
  // For now, return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockNotes]);
    }, 500);
  });
};

/**
 * Get a visit note by ID
 */
export const getNoteById = async (id: string): Promise<VisitNote | undefined> => {
  // In a real app, this would fetch from Supabase
  // For now, search in mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const note = mockNotes.find(note => note.id === id);
      resolve(note);
    }, 300);
  });
};

/**
 * Get vital signs history for a patient
 */
export const getPatientVitalSigns = async (patientId: string): Promise<VitalSigns[]> => {
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
};
