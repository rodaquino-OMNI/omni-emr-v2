
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { NoteTemplate } from '@/types/clinicalNotes';

export const useAIAssistance = (
  template: NoteTemplate,
  setSections: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setNoteAiGenerated: (value: boolean) => void
) => {
  const { language } = useTranslation();
  const [isRequestingAI, setIsRequestingAI] = useState(false);

  const requestAIAssistance = async () => {
    setIsRequestingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiSections: { [key: string]: string } = {};
      
      if (template.type === 'progress') {
        aiSections['Subjective'] = "Patient reports feeling better today. Pain has decreased from 7/10 to 3/10. Denies fever, chills, or new symptoms.";
        aiSections['Objective'] = "Vital signs stable. Temperature 36.7°C, BP 122/78, HR 72, RR 16, O2 Sat 98% on room air. Lungs clear to auscultation. Abdomen soft, non-tender.";
        aiSections['Assessment'] = "Improving as expected post-procedure. Pain well controlled with current regimen.";
        aiSections['Plan'] = "Continue current medications. Follow up in 1 week. Call if symptoms worsen.";
      } else if (template.type === 'admission') {
        aiSections['Chief Complaint'] = "Shortness of breath and chest pain for 3 days.";
        aiSections['History of Present Illness'] = "Patient is a 65-year-old male with a history of COPD who presents with worsening shortness of breath and chest pain for the past 3 days. Symptoms worse with exertion and improved with rest.";
      }
      
      setSections(prevSections => ({
        ...prevSections,
        ...aiSections
      }));
      
      setNoteAiGenerated(true);
      
      toast({
        title: language === 'pt' ? 'Assistência de IA concluída' : 'AI Assistance Completed',
        description: language === 'pt' 
          ? 'Conteúdo gerado por IA adicionado à nota' 
          : 'AI-generated content has been added to the note',
        variant: "success"
      });
    } catch (error) {
      console.error('Error requesting AI assistance:', error);
      toast({
        title: language === 'pt' ? 'Erro' : 'Error',
        description: language === 'pt' 
          ? 'Não foi possível gerar conteúdo com IA' 
          : 'Failed to generate AI content',
        variant: "destructive"
      });
    } finally {
      setIsRequestingAI(false);
    }
  };

  return { isRequestingAI, requestAIAssistance };
};
