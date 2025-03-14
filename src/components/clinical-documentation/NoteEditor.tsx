
import React from 'react';
import { ClinicalNote, NoteTemplate, NoteStatus } from '@/types/clinicalNotes';
import { useNoteEditor } from './hooks/useNoteEditor';
import NoteEditorHeader from './components/NoteEditorHeader';
import NoteEditorContainer from './editor/NoteEditorContainer';

interface NoteEditorProps {
  template: NoteTemplate;
  patientId: string;
  existingNote?: ClinicalNote;
  onSave: (note: ClinicalNote, status: NoteStatus) => void;
  onCancel: () => void;
}

const NoteEditor = ({ 
  template, 
  patientId, 
  existingNote, 
  onSave, 
  onCancel 
}: NoteEditorProps) => {
  const {
    note,
    sections,
    activeTab,
    isRequestingAI,
    setActiveTab,
    handleTitleChange,
    handleSectionChange,
    handleSave,
    requestAIAssistance
  } = useNoteEditor(template, patientId, existingNote, onSave);

  return (
    <div className="space-y-4">
      <NoteEditorHeader
        title={note.title || ''}
        onTitleChange={handleTitleChange}
        onSave={handleSave}
        onCancel={onCancel}
      />
      
      <NoteEditorContainer
        template={template}
        sections={sections}
        noteTitle={note.title || template.name}
        activeTab={activeTab}
        isRequestingAI={isRequestingAI}
        setActiveTab={setActiveTab}
        handleSectionChange={handleSectionChange}
        requestAIAssistance={requestAIAssistance}
      />
    </div>
  );
};

export default NoteEditor;
