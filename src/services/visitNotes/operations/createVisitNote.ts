
import { VisitNote } from '../types';
import { mockNotes } from '../mockData';
import { v4 as uuidv4 } from 'uuid';

/**
 * Create a new visit note
 */
export const createNote = async (note: Omit<VisitNote, 'id' | 'updatedAt'>): Promise<VisitNote> => {
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
};
