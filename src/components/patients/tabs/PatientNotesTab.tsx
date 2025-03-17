
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { FileText } from 'lucide-react';

interface PatientNote {
  id: string;
  patient_id: string;
  title: string;
  content: string;
  date: string;
  created_by: string;
  type: string;
}

interface PatientNotesTabProps extends PatientTabProps {
  filter?: string;
}

const PatientNotesTab: React.FC<PatientNotesTabProps> = ({ patientId, filter }) => {
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchNotes = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        let query = supabase
          .from('clinical_notes')
          .select('*')
          .eq('patient_id', patientId)
          .order('date', { ascending: false });
          
        if (filter) {
          query = query.eq('type', filter);
        }
        
        const { data, error } = await query;
          
        if (error) throw error;
        
        setNotes(data || []);
      } catch (err: any) {
        console.error("Error fetching clinical notes:", err);
        setError(err.message || "Failed to load clinical notes");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotes();
  }, [patientId, filter]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading clinical notes: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (notes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            No clinical notes recorded for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Clinical Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="font-medium">{note.title}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {note.date && <span>{new Date(note.date).toLocaleDateString()}</span>}
                {note.type && <span> • Type: {note.type.replace(/_/g, ' ')}</span>}
              </div>
              <div className="text-sm mt-2 line-clamp-3">{note.content}</div>
              <div className="text-xs text-muted-foreground mt-1">By: {note.created_by}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientNotesTab;
