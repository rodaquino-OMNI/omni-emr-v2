
import { VisitNote } from '../types';
import { mockNotes } from '../mockData';

/**
 * Update a visit note
 */
export const updateNote = async (id: string, updates: Partial<VisitNote>): Promise<VisitNote | undefined> => {
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
};

/**
 * Delete a visit note
 */
export const deleteNote = async (id: string): Promise<boolean> => {
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
};
