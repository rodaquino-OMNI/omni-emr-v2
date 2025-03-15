
import { ClinicalNote, NoteStatus } from "@/types/clinicalNotes";
import { offlineStorage } from "./offlineStorage";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export const noteService = {
  /**
   * Fetch notes for a patient
   */
  getNotesByPatient: async (patientId: string): Promise<ClinicalNote[]> => {
    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('clinical_notes')
        .select('*')
        .eq('patientId', patientId)
        .order('createdAt', { ascending: false });

      if (error) {
        throw error;
      }

      return data as ClinicalNote[];
    } catch (error) {
      console.error("Error fetching notes from API, falling back to offline storage:", error);
      
      // If online fetch fails, fallback to offline storage
      const offlineNotes = offlineStorage.getNotes();
      return offlineNotes.filter(note => note.patientId === patientId);
    }
  },

  /**
   * Get a specific note by ID
   */
  getNoteById: async (noteId: string): Promise<ClinicalNote | null> => {
    try {
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('clinical_notes')
        .select('*')
        .eq('id', noteId)
        .single();

      if (error) {
        throw error;
      }

      return data as ClinicalNote;
    } catch (error) {
      console.error("Error fetching note from API, falling back to offline storage:", error);
      
      // If online fetch fails, fallback to offline storage
      return offlineStorage.getNoteById(noteId);
    }
  },

  /**
   * Save a clinical note (create or update)
   */
  saveNote: async (note: ClinicalNote, status: NoteStatus): Promise<ClinicalNote> => {
    // Update status and timestamps
    const updatedNote: ClinicalNote = {
      ...note,
      status,
      updatedAt: new Date(),
    };

    // Add signature information if signed
    if (status === 'signed' && !updatedNote.signedAt) {
      updatedNote.signedAt = new Date();
    }

    // Add cosignature information if cosigned
    if (status === 'cosigned' && !updatedNote.cosignedAt) {
      updatedNote.cosignedAt = new Date();
    }

    try {
      // Generate a UUID if this is a new note
      if (!updatedNote.id || updatedNote.id.startsWith('note-')) {
        updatedNote.id = uuidv4();
      }

      // Always save to offline storage first (for offline resilience)
      offlineStorage.saveNote(updatedNote);

      // Try to save to Supabase if online
      const { data, error } = await supabase
        .from('clinical_notes')
        .upsert(updatedNote)
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log("Note saved to database:", data);
      return data as ClinicalNote;
    } catch (error) {
      console.error("Error saving note to API, saved to offline storage only:", error);
      
      // Return the offline saved note
      return updatedNote;
    }
  },

  /**
   * Request a cosignature from another provider
   */
  requestCosignature: async (noteId: string, cosignerId: string): Promise<boolean> => {
    try {
      // Fetch the note
      const note = await noteService.getNoteById(noteId);
      
      if (!note) {
        throw new Error("Note not found");
      }
      
      // Update note status and cosigner information
      const updatedNote: ClinicalNote = {
        ...note,
        status: 'pending_cosign',
        cosignerId,
        updatedAt: new Date()
      };
      
      // Save the updated note
      await noteService.saveNote(updatedNote, 'pending_cosign');
      
      // In a real app, this would send a notification to the cosigner
      
      return true;
    } catch (error) {
      console.error("Error requesting cosignature:", error);
      return false;
    }
  },

  /**
   * Synchronize offline notes to the server
   */
  syncOfflineNotes: async (): Promise<{success: number, failed: number}> => {
    const result = { success: 0, failed: 0 };
    const syncQueue = offlineStorage.getSyncQueue();
    
    // No notes to sync
    if (syncQueue.length === 0) {
      return result;
    }
    
    for (const noteId of syncQueue) {
      try {
        const note = offlineStorage.getNoteById(noteId);
        
        if (!note) continue;
        
        // Try to save to Supabase
        const { error } = await supabase
          .from('clinical_notes')
          .upsert(note);
        
        if (error) {
          throw error;
        }
        
        // Remove from sync queue if successful
        offlineStorage.removeFromSyncQueue(noteId);
        result.success++;
      } catch (error) {
        console.error(`Error syncing note ${noteId}:`, error);
        result.failed++;
      }
    }
    
    return result;
  }
};
