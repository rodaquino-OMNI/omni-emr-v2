
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { NoteTemplate } from '@/types/clinicalNotes';
import NoteSectionEditor from '../components/NoteSectionEditor';
import NoteSectionPreview from '../components/NoteSectionPreview';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, AlertCircle, Save, CloudOff, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface NoteContentProps {
  activeTab: 'editor' | 'preview';
  template: NoteTemplate;
  sections: { [key: string]: string };
  noteTitle: string;
  handleSectionChange: (sectionTitle: string, content: string) => void;
  requiredFieldsError?: string[];
  isOfflineMode?: boolean;
  lastSaved?: Date | null;
}

const NoteContent = ({ 
  activeTab, 
  template, 
  sections,
  noteTitle,
  handleSectionChange,
  requiredFieldsError = [],
  isOfflineMode = false,
  lastSaved = null
}: NoteContentProps) => {
  const { t, language } = useTranslation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionTitle) 
        ? prev.filter(s => s !== sectionTitle) 
        : [...prev, sectionTitle]
    );
  };
  
  const completedSections = template.sections.filter(
    section => sections[section.title] && sections[section.title].trim() !== ''
  ).length;
  
  const totalSections = template.sections.length;
  const progressPercentage = Math.round((completedSections / totalSections) * 100);
  
  return (
    <>
      {isOfflineMode && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-300">
          <CloudOff className="h-4 w-4" />
          <span className="text-sm">
            {language === 'pt' 
              ? 'Você está trabalhando offline. As alterações serão sincronizadas quando a conexão for restaurada.' 
              : 'You are working offline. Changes will be synchronized when connection is restored.'}
          </span>
        </div>
      )}
      
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="h-3 bg-primary/20 rounded-full w-32">
            <div 
              className="h-3 bg-primary rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="text-xs text-muted-foreground">
            {completedSections}/{totalSections} {t('sections') || 'sections'}
          </span>
        </div>
        
        {requiredFieldsError.length > 0 && (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1 px-2 py-1 h-auto dark:bg-red-950/20 dark:text-red-300 dark:border-red-800/30">
            <AlertCircle className="h-3.5 w-3.5" />
            {requiredFieldsError.length} {t('requiredFieldsMissing') || 'required fields missing'}
          </Badge>
        )}
        
        {lastSaved && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              {language === 'pt' ? 'Salvo às' : 'Last saved at'} {lastSaved.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      
      <TabsContent value="editor" className="space-y-4 mt-2">
        {template.sections.map((section, index) => {
          const isExpanded = expandedSections.includes(section.title);
          const hasError = requiredFieldsError.includes(section.title);
          
          return (
            <div 
              key={index} 
              className={`border rounded-lg overflow-hidden transition-all ${
                hasError ? 'border-red-200 dark:border-red-800/30' : 'border-border'
              }`}
            >
              <div 
                className={`flex justify-between items-center p-3 cursor-pointer ${
                  hasError ? 'bg-red-50 dark:bg-red-950/20' : 'bg-muted/30'
                }`}
                onClick={() => toggleSection(section.title)}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">
                    {section.title}
                    {section.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  
                  {sections[section.title] && sections[section.title].trim() !== '' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-800/30">
                      <CheckSquare className="h-3 w-3 mr-1" />
                      {t('completed') || 'Completed'}
                    </Badge>
                  )}
                  
                  {hasError && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800/30">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {t('required') || 'Required'}
                    </Badge>
                  )}
                </div>
                
                <span>{isExpanded ? '▲' : '▼'}</span>
              </div>
              
              {isExpanded && (
                <div className="p-3 animate-fade-in">
                  <NoteSectionEditor
                    sectionTitle={section.title}
                    content={sections[section.title] || ''}
                    onChange={(content) => handleSectionChange(section.title, content)}
                    isRequired={section.required}
                    hasError={requiredFieldsError.includes(section.title)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </TabsContent>
      
      <TabsContent value="preview" className="mt-2">
        <div className="prose prose-sm max-w-none p-6 border rounded-lg bg-white dark:bg-gray-800">
          <h1 className="text-2xl font-bold mb-6">{noteTitle}</h1>
          {template.sections.map((section, index) => (
            <NoteSectionPreview
              key={index}
              sectionTitle={section.title}
              content={sections[section.title] || ''}
            />
          ))}
        </div>
      </TabsContent>
    </>
  );
};

export default NoteContent;
