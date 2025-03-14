
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ClipboardCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface NoteEditorTabsProps {
  activeTab: 'editor' | 'preview';
  onTabChange: (value: 'editor' | 'preview') => void;
}

const NoteEditorTabs = ({ activeTab, onTabChange }: NoteEditorTabsProps) => {
  const { language } = useTranslation();
  
  return (
    <Tabs 
      defaultValue="editor" 
      value={activeTab} 
      onValueChange={(value) => onTabChange(value as 'editor' | 'preview')}
    >
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
  );
};

export default NoteEditorTabs;
