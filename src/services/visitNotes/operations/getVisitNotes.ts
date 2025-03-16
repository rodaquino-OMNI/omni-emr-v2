
import { mockVisitNotes } from '../mockData';
import { VisitNote, VitalSigns } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { getLatestVitalSigns } from './vitalSignsOperations';

/**
 * Get all visit notes
 * @returns An array of visit notes
 */
export const getAllNotes = async (): Promise<VisitNote[]> => {
  try {
    // Check if we're in a development environment using mock data
    if (process.env.NODE_ENV === 'development' && mockVisitNotes.length > 0) {
      console.log('Using mock visit notes data');
      return mockVisitNotes;
    }

    // Get visit notes from Supabase
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('note_type', 'visit_note')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching visit notes:', error);
      return [];
    }

    // Map database results to the VisitNote interface
    return data.map(note => ({
      id: note.id,
      patientId: note.patient_id,
      patientName: note.patient_name || 'Unknown Patient',
      date: note.created_at,
      status: note.status || 'active',
      title: note.note_title,
      summary: note.note_content,
      createdBy: note.author_name,
      createdById: note.author_id,
      updatedAt: note.updated_at
    }));
  } catch (error) {
    console.error('Error in getAllNotes:', error);
    return [];
  }
};

/**
 * Get a visit note by ID
 * @param id The ID of the visit note
 * @returns The visit note, or null if not found
 */
export const getNoteById = async (id: string): Promise<VisitNote | null> => {
  try {
    // Check if we're in a development environment using mock data
    if (process.env.NODE_ENV === 'development' && mockVisitNotes.length > 0) {
      const note = mockVisitNotes.find(note => note.id === id);
      return note || null;
    }

    // Get the visit note from Supabase
    const { data, error } = await supabase
      .from('clinical_notes')
      .select('*')
      .eq('id', id)
      .eq('note_type', 'visit_note')
      .single();

    if (error) {
      console.error('Error fetching visit note:', error);
      return null;
    }

    if (!data) return null;

    // Map to VisitNote interface
    const visitNote: VisitNote = {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name || 'Unknown Patient',
      date: data.created_at,
      status: data.status || 'active',
      title: data.note_title,
      summary: data.note_content,
      createdBy: data.author_name,
      createdById: data.author_id,
      updatedAt: data.updated_at
    };

    // Get the latest vital signs for this patient
    visitNote.vitalSigns = await getPatientVitalSigns(data.patient_id);

    return visitNote;
  } catch (error) {
    console.error('Error in getNoteById:', error);
    return null;
  }
};

/**
 * Get vital signs for a patient
 * @param patientId The patient's ID
 * @returns The patient's vital signs, or null if not found
 */
export const getPatientVitalSigns = async (patientId: string): Promise<VitalSigns | null> => {
  try {
    // Use the optimized materialized view via the helper function
    return await getLatestVitalSigns(patientId);
  } catch (error) {
    console.error('Error in getPatientVitalSigns:', error);
    return null;
  }
};
