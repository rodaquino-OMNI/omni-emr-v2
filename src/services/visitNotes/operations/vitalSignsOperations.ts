
import { VisitNote, VitalSigns } from '../types';
import { mockNotes } from '../mockData';

/**
 * Record vital signs for a visit note
 */
export const recordVitalSigns = async (noteId: string, vitalSigns: VitalSigns): Promise<VisitNote | undefined> => {
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
};
