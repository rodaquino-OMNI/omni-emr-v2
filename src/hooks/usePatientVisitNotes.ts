
import { useSupabaseQuery } from './api/useSupabaseQuery';
import { supabase } from '@/integrations/supabase/client';

export interface VisitNote {
  id: string;
  patient_id: string;
  provider_id: string;
  visit_date: string;
  title: string;
  visit_type: string;
  chief_complaint?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Hook for fetching patient visit notes with caching
 */
export function usePatientVisitNotes(patientId?: string) {
  return useSupabaseQuery<VisitNote[]>(
    ['patientVisitNotes', patientId || ''],
    async () => {
      if (!patientId) return [];

      // Fetch visit notes for patient
      const { data, error } = await supabase
        .from('visit_notes')
        .select(`
          *,
          providers:provider_id (name)
        `)
        .eq('patient_id', patientId)
        .order('visit_date', { ascending: false });

      if (error) throw error;
      
      return data as unknown as VisitNote[];
    },
    {
      enabled: !!patientId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000 // 15 minutes
    }
  );
}

/**
 * Hook for fetching a single visit note with caching
 */
export function useVisitNoteDetails(noteId?: string) {
  return useSupabaseQuery<VisitNote | null>(
    ['visitNote', noteId || ''],
    async () => {
      if (!noteId) return null;

      // Fetch visit note details
      const { data, error } = await supabase
        .from('visit_notes')
        .select(`
          *,
          patients:patient_id (id, first_name, last_name, mrn),
          vital_signs:id (*)
        `)
        .eq('id', noteId)
        .maybeSingle();

      if (error) throw error;
      
      return data as unknown as VisitNote;
    },
    {
      enabled: !!noteId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 15 * 60 * 1000 // 15 minutes
    }
  );
}
