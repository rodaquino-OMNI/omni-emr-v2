
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle, AlertCircle, User, Calendar } from 'lucide-react';
import { ClinicalNote } from '@/types/clinicalNotes';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';

interface NotesListProps {
  notes: ClinicalNote[];
  loading?: boolean;
  onViewNote: (noteId: string) => void;
  onEditNote?: (noteId: string) => void;
}

const NotesList = ({ notes, loading, onViewNote, onEditNote }: NotesListProps) => {
  const { language } = useTranslation();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending_cosign':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'signed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cosigned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4" />;
      case 'pending_cosign':
        return <AlertCircle className="h-4 w-4" />;
      case 'signed':
      case 'cosigned':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  const getNoteTypeLabel = (type: string) => {
    switch (type) {
      case 'progress':
        return language === 'pt' ? 'Nota de Evolução' : 'Progress Note';
      case 'admission':
        return language === 'pt' ? 'Nota de Admissão' : 'Admission Note';
      case 'consultation':
        return language === 'pt' ? 'Consulta' : 'Consultation';
      case 'procedure':
        return language === 'pt' ? 'Procedimento' : 'Procedure Note';
      case 'discharge':
        return language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return language === 'pt' ? 'Rascunho' : 'Draft';
      case 'pending_cosign':
        return language === 'pt' ? 'Aguardando Assinatura' : 'Pending Cosign';
      case 'signed':
        return language === 'pt' ? 'Assinado' : 'Signed';
      case 'cosigned':
        return language === 'pt' ? 'Coassinado' : 'Cosigned';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
        <h3 className="mt-2 text-lg font-medium">
          {language === 'pt' ? 'Nenhuma nota encontrada' : 'No notes found'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'pt' 
            ? 'Crie uma nova nota clínica para este paciente'
            : 'Create a new clinical note for this patient'
          }
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <Card key={note.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="p-4 flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{note.title}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`flex items-center gap-1 ${getStatusColor(note.status)}`}
                  >
                    {getStatusIcon(note.status)}
                    {getStatusLabel(note.status)}
                  </Badge>
                </div>
                
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {note.authorName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                    </div>
                    <div>{getNoteTypeLabel(note.type)}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex bg-muted/20 border-t md:border-t-0 md:border-l">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-none h-12 px-3"
                  onClick={() => onViewNote(note.id)}
                >
                  {language === 'pt' ? 'Visualizar' : 'View'}
                </Button>
                
                {note.status === 'draft' && onEditNote && (
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-none h-12 px-3 border-l"
                    onClick={() => onEditNote(note.id)}
                  >
                    {language === 'pt' ? 'Editar' : 'Edit'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;
