
import { v4 as uuidv4 } from 'uuid';
import { VisitNote } from '../types';
import { mockVisitNotes } from '../mockData';
import { supabase, logAuditEvent } from '@/integrations/supabase/client';

/**
 * Create a new visit note
 * @param note The visit note to create
 * @returns The created visit note with ID and default values filled in
 */
export const createNote = async (note: Partial<VisitNote>): Promise<VisitNote> => {
  try {
    // Generate an ID if none is provided
    const noteId = note.id || uuidv4();
    const timestamp = new Date().toISOString();
    
    // Check if we're in a development environment using mock data
    if (process.env.NODE_ENV === 'development' && mockVisitNotes.length > 0) {
      const newNote: VisitNote = {
        id: noteId,
        patientId: note.patientId || '',
        patientName: note.patientName || 'Unknown Patient',
        date: timestamp,
        status: note.status || 'active',
        title: note.title || 'New Visit Note',
        summary: note.summary || '',
        createdBy: note.createdBy,
        createdById: note.createdById,
        updatedAt: timestamp,
        vitalSigns: note.vitalSigns,
        version: 1
      };
      mockVisitNotes.push(newNote);
      return newNote;
    }

    // Create a new visit note in Supabase
    const { data, error } = await supabase
      .from('clinical_notes')
      .insert({
        id: noteId,
        patient_id: note.patientId,
        patient_name: note.patientName || 'Unknown Patient',
        note_title: note.title || 'New Visit Note',
        note_content: note.summary || '',
        note_type: 'visit_note',
        author_id: note.createdById,
        author_name: note.createdBy || 'Unknown',
        encounter_date: timestamp,
        created_at: timestamp,
        updated_at: timestamp,
        status: note.status || 'active',
        version: 1
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating visit note:', error);
      throw error;
    }

    // Log audit event for HIPAA compliance
    if (data && note.createdById) {
      await logAuditEvent(
        note.createdById,
        'create',
        'VisitNote',
        data.id,
        {
          patientId: note.patientId,
          noteType: 'visit_note'
        }
      );
    }

    // Map the result back to VisitNote interface
    return {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name || 'Unknown Patient',
      date: data.created_at,
      status: data.status || 'active',
      title: data.note_title,
      summary: data.note_content,
      createdBy: data.author_name,
      createdById: data.author_id,
      updatedAt: data.updated_at,
      vitalSigns: note.vitalSigns,
      version: data.version
    };
  } catch (error) {
    console.error('Error in createNote:', error);
    // Return a fallback note if there's an error
    return {
      id: uuidv4(),
      patientId: note.patientId || '',
      patientName: note.patientName || 'Unknown Patient',
      date: new Date().toISOString(),
      status: 'active',
      title: note.title || 'New Visit Note',
      summary: note.summary || '',
      createdBy: note.createdBy,
      createdById: note.createdById,
      version: 1
    };
  }
};
