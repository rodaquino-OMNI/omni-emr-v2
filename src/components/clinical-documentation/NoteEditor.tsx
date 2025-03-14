
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ClipboardCheck } from 'lucide-react';
import { ClinicalNote, NoteTemplate, NoteStatus } from '@/types/clinicalNotes';
import { useTranslation } from '@/hooks/useTranslation';
import { useNoteEditor } from './hooks/useNoteEditor';
import NoteEditorHeader from './components/NoteEditorHeader';
import NoteSectionEditor from './components/NoteSectionEditor';
import NoteSectionPreview from './components/NoteSectionPreview';
import AIAssistButton from './components/AIAssistButton';

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
  const { language } = useTranslation();
  
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
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-md">
              {language === 'pt' ? 'Editor de nota' : 'Note Editor'}
            </CardTitle>
            <Tabs defaultValue="editor" value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'preview')}>
              <TabsList>
                <TabsTrigger value="editor">
                  <FileText className="h-4 w-4 mr-1" />
                  {language === 'pt' ? 'Editor' : 'Editor'}
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <ClipboardCheck className="h-4 w-4 mr-1" />
                  {language === 'pt' ? 'Visualizar' : 'Preview'}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <AIAssistButton 
              isRequestingAI={isRequestingAI}
              onClick={requestAIAssistance}
            />
          </div>
          
          <TabsContent value="editor" className="space-y-4 mt-2">
            {template.sections.map((section, index) => (
              <NoteSectionEditor
                key={index}
                sectionTitle={section.title}
                content={sections[section.title] || ''}
                onChange={(content) => handleSectionChange(section.title, content)}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="preview" className="mt-2">
            <div className="prose prose-sm max-w-none">
              <h1>{note.title}</h1>
              {template.sections.map((section, index) => (
                <NoteSectionPreview
                  key={index}
                  sectionTitle={section.title}
                  content={sections[section.title] || ''}
                />
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteEditor;
