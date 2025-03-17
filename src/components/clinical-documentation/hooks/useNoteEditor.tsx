
import { useState, useCallback } from 'react';
import { ClinicalNote, NoteTemplate, NoteStatus } from '@/types/clinicalNotes';
import { useAuth } from '@/context/AuthContext';
import { useNoteContent } from './note-editor/useNoteContent';
import { useNoteValidation } from './note-editor/useNoteValidation';
import { useAIAssistance } from './note-editor/useAIAssistance';
import { useNoteSaving } from './note-editor/useNoteSaving';
import { useCosignature } from './note-editor/useCosignature';
import { useConnectivity } from './note-editor/useConnectivity';

export const useNoteEditor = (
  template: NoteTemplate,
  patientId: string,
  existingNote?: ClinicalNote,
  onSave?: (note: ClinicalNote, status: NoteStatus) => void
) => {
  const { user } = useAuth();
  const { isOfflineMode } = useConnectivity();
  
  const [note, setNote] = useState<Partial<ClinicalNote>>({
    patientId,
    type: template.type,
    title: existingNote?.title || template.name,
    content: existingNote?.content || '',
    status: existingNote?.status || 'draft',
    aiGenerated: existingNote?.aiGenerated || false
  });
  
  const {
    sections,
    activeTab,
    requiredFieldsError,
    setActiveTab,
    setRequiredFieldsError,
    handleSectionChange,
    compileNoteContent
  } = useNoteContent(template, existingNote);
  
  const { validateNote } = useNoteValidation(template, sections, setRequiredFieldsError);
  
  const { isRequestingAI, requestAIAssistance } = useAIAssistance(
    template, 
    (newSections) => {
      // Update sections
      if (typeof newSections === 'function') {
        const updatedSections = newSections({});
        // Do nothing
      } else {
        // Update sections directly
        Object.keys(newSections).forEach(sectionTitle => {
          handleSectionChange(sectionTitle, newSections[sectionTitle]);
        });
      }
    },
    (aiGenerated) => setNote(prev => ({ ...prev, aiGenerated }))
  );
  
  const { isSaving, handleSave: saveNote } = useNoteSaving(patientId, existingNote, onSave);
  
  const { requestCosignature } = useCosignature();

  const handleTitleChange = (title: string) => {
    setNote(prev => ({ ...prev, title }));
  };

  const handleSave = async (status: NoteStatus) => {
    if (!user) return;
    
    let isValid = true;
    if (status === 'signed' || status === 'cosigned') {
      isValid = validateNote();
      if (!isValid) {
        return;
      }
    }
    
    const content = compileNoteContent();
    await saveNote(note, content, status, isValid);
  };

  const handleRequestCosignature = async (cosignerId: string) => {
    if (!existingNote?.id) return false;
    return await requestCosignature(existingNote.id, cosignerId);
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
    requestCosignature: handleRequestCosignature,
    requestAIAssistance,
    validateNote
  };
};
