
import { VisitNote } from '../types';
import { mockVisitNotes } from '../mockData';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';

/**
 * Update an existing visit note
 * @param note The visit note to update
 * @returns True if the update was successful, false otherwise
 */
export const updateNote = async (note: VisitNote): Promise<boolean> => {
  try {
    // Check if we're in a development environment using mock data
    if (process.env.NODE_ENV === 'development' && mockVisitNotes.length > 0) {
      const index = mockVisitNotes.findIndex(n => n.id === note.id);
      if (index !== -1) {
        mockVisitNotes[index] = {
          ...note,
          updatedAt: new Date().toISOString()
        };
        return true;
      }
      return false;
    }

    // Update the visit note in Supabase
    const { error } = await supabase
      .from('clinical_notes')
      .update({
        note_title: note.title,
        note_content: note.summary,
        status: note.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', note.id);

    if (error) {
      console.error('Error updating visit note:', error);
      return false;
    }

    // Log audit event for HIPAA compliance
    if (note.createdById) {
      await logAuditEvent(
        note.createdById,
        'update',
        'VisitNote',
        note.id,
        {
          patientId: note.patientId,
          noteType: 'visit_note'
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error in updateNote:', error);
    return false;
  }
};

/**
 * Delete a visit note
 * @param id The ID of the visit note to delete
 * @param userId The ID of the user performing the deletion
 * @returns True if the deletion was successful, false otherwise
 */
export const deleteNote = async (id: string, userId?: string): Promise<boolean> => {
  try {
    // Check if we're in a development environment using mock data
    if (process.env.NODE_ENV === 'development' && mockVisitNotes.length > 0) {
      const index = mockVisitNotes.findIndex(note => note.id === id);
      if (index !== -1) {
        mockVisitNotes.splice(index, 1);
        return true;
      }
      return false;
    }

    // First, get the note to log details for audit
    const { data: noteData } = await supabase
      .from('clinical_notes')
      .select('patient_id')
      .eq('id', id)
      .single();

    // Delete the visit note from Supabase
    const { error } = await supabase
      .from('clinical_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting visit note:', error);
      return false;
    }

    // Log audit event for HIPAA compliance
    if (userId && noteData) {
      await logAuditEvent(
        userId,
        'delete',
        'VisitNote',
        id,
        {
          patientId: noteData.patient_id,
          noteType: 'visit_note'
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Error in deleteNote:', error);
    return false;
  }
};
