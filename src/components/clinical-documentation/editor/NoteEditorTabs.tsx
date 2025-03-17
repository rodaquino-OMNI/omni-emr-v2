
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ClipboardCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

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
      className="w-auto"
    >
      <TabsList className="grid grid-cols-2 w-[200px] h-9">
        <TabsTrigger value="editor" className={cn(
          "transition-all duration-200",
          activeTab === "editor" ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""
        )}>
          <FileText className="h-4 w-4 mr-1" />
          {language === 'pt' ? 'Editor' : 'Editor'}
        </TabsTrigger>
        <TabsTrigger value="preview" className={cn(
          "transition-all duration-200",
          activeTab === "preview" ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""
        )}>
          <ClipboardCheck className="h-4 w-4 mr-1" />
          {language === 'pt' ? 'Visualizar' : 'Preview'}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default NoteEditorTabs;
