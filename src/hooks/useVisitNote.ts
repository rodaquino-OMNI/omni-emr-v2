
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VisitNote } from '@/types/visitNotes';

export const useVisitNote = (noteId?: string) => {
  const [note, setNote] = useState<VisitNote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisitNote = async () => {
      if (!noteId) {
        setLoading(false);
        setError('Note ID is required');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('visit_notes')
          .select(`
            *,
            provider:profiles(*),
            patient:patients(*)
          `)
          .eq('id', noteId)
          .single();

        if (supabaseError) throw supabaseError;

        setNote(data as VisitNote);
      } catch (err) {
        console.error('Error fetching visit note:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch visit note');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitNote();
  }, [noteId]);

  return { note, loading, error };
};
