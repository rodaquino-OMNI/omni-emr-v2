
import { useState } from 'react';
import { ClinicalNote, NoteStatus } from '@/types/clinicalNotes';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { noteService } from '@/services/clinicalNotes/noteService';
import { offlineStorage } from '@/services/clinicalNotes/offlineStorage';

export const useNoteSaving = (
  patientId: string,
  existingNote?: ClinicalNote,
  onSave?: (note: ClinicalNote, status: NoteStatus) => void
) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Check online status
  useState(() => {
    const checkConnectivity = () => {
      setIsOfflineMode(!navigator.onLine);
    };
    
    window.addEventListener('online', checkConnectivity);
    window.addEventListener('offline', checkConnectivity);
    checkConnectivity();
    
    return () => {
      window.removeEventListener('online', checkConnectivity);
      window.removeEventListener('offline', checkConnectivity);
    };
  });

  const handleSave = async (
    noteData: Partial<ClinicalNote>,
    compiledContent: string, 
    status: NoteStatus,
    isValid: boolean = true
  ) => {
    if (!user) return;
    
    if ((status === 'signed' || status === 'cosigned') && !isValid) {
      return;
    }
    
    setIsSaving(true);
    try {
      const updatedNote: ClinicalNote = {
        id: existingNote?.id || `note-${Date.now()}`,
        patientId,
        authorId: user.id,
        authorName: user.name,
        type: noteData.type!,
        title: noteData.title || '',
        content: compiledContent,
        status,
        createdAt: existingNote?.createdAt || new Date(),
        updatedAt: new Date(),
        aiGenerated: noteData.aiGenerated || false,
        needsSync: isOfflineMode
      };
      
      const savedNote = await noteService.saveNote(updatedNote, status);
      
      if (isOfflineMode) {
        offlineStorage.saveNote(savedNote);
        
        toast({
          title: language === 'pt' ? 'Nota salva offline' : 'Note saved offline',
          description: language === 'pt'
            ? 'A nota será sincronizada quando a conexão for restaurada.'
            : 'The note will be synced when connection is restored.',
          variant: "info"
        });
      }
      
      if (onSave) {
        onSave(savedNote, status);
      }
      
      toast({
        title: language === 'pt' ? 'Nota salva com sucesso' : 'Note saved successfully',
        description: language === 'pt'
          ? `A nota foi ${status === 'signed' ? 'assinada' : status === 'cosigned' ? 'coassinada' : 'salva'} com sucesso.`
          : `The note has been ${status === 'signed' ? 'signed' : status === 'cosigned' ? 'cosigned' : 'saved'} successfully.`,
        variant: "success"
      });
      
      return savedNote;
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: language === 'pt' ? 'Erro ao salvar nota' : 'Error saving note',
        description: language === 'pt'
          ? 'Ocorreu um erro ao salvar a nota. Tente novamente.'
          : 'An error occurred while saving the note. Please try again.',
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    isOfflineMode,
    handleSave
  };
};
