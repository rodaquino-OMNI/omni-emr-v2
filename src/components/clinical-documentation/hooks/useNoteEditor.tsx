
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { ClinicalNote, NoteTemplate, NoteStatus } from '@/types/clinicalNotes';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { templateService } from '@/services/clinicalNotes/templateService';
import { noteService } from '@/services/clinicalNotes/noteService';
import { offlineStorage } from '@/services/clinicalNotes/offlineStorage';

export const useNoteEditor = (
  template: NoteTemplate,
  patientId: string,
  existingNote?: ClinicalNote,
  onSave?: (note: ClinicalNote, status: NoteStatus) => void
) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  
  const [note, setNote] = useState<Partial<ClinicalNote>>({
    patientId,
    type: template.type,
    title: existingNote?.title || template.name,
    content: existingNote?.content || '',
    status: existingNote?.status || 'draft',
    aiGenerated: existingNote?.aiGenerated || false
  });
  
  const [sections, setSections] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isRequestingAI, setIsRequestingAI] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [requiredFieldsError, setRequiredFieldsError] = useState<string[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Check connectivity status
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    // Initialize sections from template
    const initialSections: { [key: string]: string } = {};
    template.sections.forEach(section => {
      initialSections[section.title] = existingNote?.content.includes(section.title) 
        ? extractSectionContent(existingNote.content, section.title) 
        : '';
    });
    setSections(initialSections);
  }, [template, existingNote]);

  const extractSectionContent = (content: string, sectionTitle: string) => {
    const regex = new RegExp(`## ${sectionTitle}\\s*([\\s\\S]*?)(?=## |$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const compileNoteContent = () => {
    let compiledContent = '';
    template.sections.forEach(section => {
      const sectionContent = sections[section.title] || '';
      compiledContent += `## ${section.title}\n${sectionContent}\n\n`;
    });
    return compiledContent.trim();
  };

  const handleTitleChange = (title: string) => {
    setNote(prev => ({ ...prev, title }));
  };

  const handleSectionChange = (sectionTitle: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [sectionTitle]: content
    }));
    
    // Clear validation errors when user starts typing
    if (requiredFieldsError.includes(sectionTitle)) {
      setRequiredFieldsError(prev => prev.filter(field => field !== sectionTitle));
    }
  };

  const validateNote = useCallback(() => {
    const missingFields = templateService.validateRequiredSections(template, sections);
    setRequiredFieldsError(missingFields);
    return missingFields.length === 0;
  }, [sections, template]);

  const handleSave = async (status: NoteStatus) => {
    if (!user) return;
    
    // For signed notes, validate required fields
    if (status === 'signed' || status === 'cosigned') {
      const isValid = validateNote();
      if (!isValid) {
        toast.error(
          language === 'pt' ? 'Campos obrigatórios incompletos' : 'Required fields incomplete',
          {
            description: language === 'pt'
              ? 'Preencha todos os campos obrigatórios antes de assinar a nota.'
              : 'Please complete all required fields before signing the note.'
          }
        );
        return;
      }
    }
    
    setIsSaving(true);
    try {
      const content = compileNoteContent();
      const updatedNote: ClinicalNote = {
        id: existingNote?.id || `note-${Date.now()}`,
        patientId,
        authorId: user.id,
        authorName: user.name,
        type: template.type,
        title: note.title || template.name,
        content,
        status,
        createdAt: existingNote?.createdAt || new Date(),
        updatedAt: new Date(),
        aiGenerated: note.aiGenerated || false,
        needsSync: isOfflineMode // Mark for sync if offline
      };
      
      // Save the note
      const savedNote = await noteService.saveNote(updatedNote, status);
      
      // If we're offline, also save to local storage
      if (isOfflineMode) {
        offlineStorage.saveNote(savedNote);
        
        toast.info(
          language === 'pt' ? 'Nota salva offline' : 'Note saved offline',
          {
            description: language === 'pt'
              ? 'A nota será sincronizada quando a conexão for restaurada.'
              : 'The note will be synced when connection is restored.'
          }
        );
      }
      
      if (onSave) {
        onSave(savedNote, status);
      }
      
      toast.success(
        language === 'pt' ? 'Nota salva com sucesso' : 'Note saved successfully',
        {
          description: language === 'pt'
            ? `A nota foi ${status === 'signed' ? 'assinada' : status === 'cosigned' ? 'coassinada' : 'salva'} com sucesso.`
            : `The note has been ${status === 'signed' ? 'signed' : status === 'cosigned' ? 'cosigned' : 'saved'} successfully.`
        }
      );
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(
        language === 'pt' ? 'Erro ao salvar nota' : 'Error saving note',
        {
          description: language === 'pt'
            ? 'Ocorreu um erro ao salvar a nota. Tente novamente.'
            : 'An error occurred while saving the note. Please try again.'
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  const requestCosignature = async (cosignerId: string) => {
    if (!existingNote?.id) return;
    
    try {
      const success = await noteService.requestCosignature(existingNote.id, cosignerId);
      
      if (success) {
        toast.success(
          language === 'pt' ? 'Solicitação de coassinatura enviada' : 'Cosignature request sent',
          {
            description: language === 'pt'
              ? 'A solicitação de coassinatura foi enviada com sucesso.'
              : 'The cosignature request has been sent successfully.'
          }
        );
        return true;
      } else {
        throw new Error('Failed to request cosignature');
      }
    } catch (error) {
      console.error('Error requesting cosignature:', error);
      toast.error(
        language === 'pt' ? 'Erro ao solicitar coassinatura' : 'Error requesting cosignature',
        {
          description: language === 'pt'
            ? 'Ocorreu um erro ao solicitar a coassinatura. Tente novamente.'
            : 'An error occurred while requesting the cosignature. Please try again.'
        }
      );
      return false;
    }
  };

  const requestAIAssistance = async () => {
    if (!user) return;
    
    setIsRequestingAI(true);
    try {
      // This would be an API call to an AI service in a real app
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock AI generated content based on note type
      const aiSections: { [key: string]: string } = { ...sections };
      
      if (template.type === 'progress') {
        aiSections['Subjective'] = "Patient reports feeling better today. Pain has decreased from 7/10 to 3/10. Denies fever, chills, or new symptoms.";
        aiSections['Objective'] = "Vital signs stable. Temperature 36.7°C, BP 122/78, HR 72, RR 16, O2 Sat 98% on room air. Lungs clear to auscultation. Abdomen soft, non-tender.";
        aiSections['Assessment'] = "Improving as expected post-procedure. Pain well controlled with current regimen.";
        aiSections['Plan'] = "Continue current medications. Follow up in 1 week. Call if symptoms worsen.";
      } else if (template.type === 'admission') {
        // Add mock AI content for admission notes
        aiSections['Chief Complaint'] = "Shortness of breath and chest pain for 3 days.";
        aiSections['History of Present Illness'] = "Patient is a 65-year-old male with a history of COPD who presents with worsening shortness of breath and chest pain for the past 3 days. Symptoms worse with exertion and improved with rest.";
      }
      
      setSections(aiSections);
      setNote(prev => ({ ...prev, aiGenerated: true }));
      
      toast.success(
        language === 'pt' ? 'Assistência de IA concluída' : 'AI Assistance Completed',
        {
          description: language === 'pt' 
            ? 'Conteúdo gerado por IA adicionado à nota' 
            : 'AI-generated content has been added to the note'
        }
      );
    } catch (error) {
      console.error('Error requesting AI assistance:', error);
      toast.error(
        language === 'pt' ? 'Erro' : 'Error',
        {
          description: language === 'pt' 
            ? 'Não foi possível gerar conteúdo com IA' 
            : 'Failed to generate AI content'
        }
      );
    } finally {
      setIsRequestingAI(false);
    }
  };

  return {
    note,
    sections,
    activeTab,
    isRequestingAI,
    isSaving,
    isOfflineMode,
    requiredFieldsError,
    setActiveTab,
    handleTitleChange,
    handleSectionChange,
    handleSave,
    requestCosignature,
    requestAIAssistance,
    validateNote
  };
};
