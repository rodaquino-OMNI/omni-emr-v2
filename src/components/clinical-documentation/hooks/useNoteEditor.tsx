
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ClinicalNote, NoteTemplate, NoteStatus } from '@/types/clinicalNotes';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

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
  };

  const handleSave = (status: NoteStatus) => {
    if (!user || !onSave) return;
    
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
      aiGenerated: note.aiGenerated || false
    };
    
    onSave(updatedNote, status);
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
    setActiveTab,
    handleTitleChange,
    handleSectionChange,
    handleSave,
    requestAIAssistance
  };
};
