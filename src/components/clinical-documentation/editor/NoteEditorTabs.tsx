
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ClipboardCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface NoteEditorTabsProps {
  activeTab: 'editor' | 'preview';
  onTabChange: (value: 'editor' | 'preview') => void;
}

const NoteEditorTabs: React.FC<NoteEditorTabsProps> = ({ activeTab, onTabChange }: NoteEditorTabsProps) => {
  const { t, language } = useTranslation();
  
  // Create a type-safe handler
  const handleTabChange = (value: string) => {
    if (value === 'editor' || value === 'preview') {
      onTabChange(value);
    }
  };
  
  return (
    <Tabs 
      defaultValue="editor" 
      value={activeTab} 
      onValueChange={handleTabChange}
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
