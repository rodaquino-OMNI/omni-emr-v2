
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { NoteTemplate } from '@/types/clinicalNotes';
import NoteEditorTabs from './NoteEditorTabs';
import NoteContent from './NoteContent';
import AIAssistButton from '../components/AIAssistButton';

interface NoteEditorContainerProps {
  template: NoteTemplate;
  sections: { [key: string]: string };
  noteTitle: string;
  activeTab: 'editor' | 'preview';
  isRequestingAI: boolean;
  isOfflineMode?: boolean;
  requiredFieldsError?: string[];
  setActiveTab: (tab: 'editor' | 'preview') => void;
  handleSectionChange: (sectionTitle: string, content: string) => void;
  requestAIAssistance: () => void;
}

const NoteEditorContainer = ({
  template,
  sections,
  noteTitle,
  activeTab,
  isRequestingAI,
  isOfflineMode = false,
  requiredFieldsError = [],
  setActiveTab,
  handleSectionChange,
  requestAIAssistance
}: NoteEditorContainerProps) => {
  const { language } = useTranslation();
  
  return (
    <Card className="border-primary/10 shadow-md shadow-primary/5">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md font-medium">
            {language === 'pt' ? 'Editor de nota' : 'Note Editor'}
          </CardTitle>
          <NoteEditorTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 bg-muted/30 border-b">
          <AIAssistButton 
            isRequestingAI={isRequestingAI}
            onClick={requestAIAssistance}
            disabled={isOfflineMode}
          />
        </div>
        
        <div className="p-4">
          <NoteContent
            activeTab={activeTab}
            template={template}
            sections={sections}
            noteTitle={noteTitle}
            handleSectionChange={handleSectionChange}
            requiredFieldsError={requiredFieldsError}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteEditorContainer;
