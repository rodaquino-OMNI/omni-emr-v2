
import { useCallback } from 'react';
import { NoteTemplate } from '@/types/clinicalNotes';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { templateService } from '@/services/clinicalNotes/templateService';

export const useNoteValidation = (
  template: NoteTemplate, 
  sections: { [key: string]: string },
  setRequiredFieldsError: (fields: string[]) => void
) => {
  const { language } = useTranslation();
  
  const validateNote = useCallback(() => {
    const missingFields = templateService.validateRequiredSections(template, sections);
    setRequiredFieldsError(missingFields);
    
    if (missingFields.length > 0) {
      toast({
        title: language === 'pt' ? 'Campos obrigatórios incompletos' : 'Required fields incomplete',
        description: language === 'pt'
          ? 'Preencha todos os campos obrigatórios antes de assinar a nota.'
          : 'Please complete all required fields before signing the note.',
        variant: "destructive"
      });
    }
    
    return missingFields.length === 0;
  }, [sections, template, language, setRequiredFieldsError]);

  return { validateNote };
};
