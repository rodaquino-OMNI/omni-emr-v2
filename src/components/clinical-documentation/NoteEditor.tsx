
import React, { useState } from 'react';
import { ClinicalNote, NoteTemplate, NoteStatus } from '@/types/clinicalNotes';
import { useNoteEditor } from './hooks/useNoteEditor';
import NoteEditorHeader from './components/NoteEditorHeader';
import NoteEditorContainer from './editor/NoteEditorContainer';
import CosignatureRequestModal from './components/CosignatureRequestModal';

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
  const [cosignatureModalOpen, setCosignatureModalOpen] = useState(false);
  
  const {
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
  } = useNoteEditor(template, patientId, existingNote, onSave);

  return (
    <div className="space-y-4">
      <NoteEditorHeader
        title={note.title || ''}
        onTitleChange={handleTitleChange}
        onSave={handleSave}
        onCancel={onCancel}
        isSaving={isSaving}
        isOfflineMode={isOfflineMode}
        requiredFieldsError={requiredFieldsError}
        validateNote={validateNote}
      />
      
      <NoteEditorContainer
        template={template}
        sections={sections}
        noteTitle={note.title || template.name}
        activeTab={activeTab}
        isRequestingAI={isRequestingAI}
        isOfflineMode={isOfflineMode}
        requiredFieldsError={requiredFieldsError}
        setActiveTab={setActiveTab}
        handleSectionChange={handleSectionChange}
        requestAIAssistance={requestAIAssistance}
      />
      
      {/* This would be implemented in a real app */}
      {/* <Button
        variant="outline"
        className="mt-4"
        onClick={() => setCosignatureModalOpen(true)}
      >
        Request Cosignature
      </Button> */}
      
      {/* Implement cosignature request modal for future use */}
      {/* <CosignatureRequestModal
        open={cosignatureModalOpen}
        onOpenChange={setCosignatureModalOpen}
        onRequestCosignature={(cosignerId) => {
          requestCosignature(cosignerId);
          setCosignatureModalOpen(false);
        }}
      /> */}
    </div>
  );
};

export default NoteEditor;
