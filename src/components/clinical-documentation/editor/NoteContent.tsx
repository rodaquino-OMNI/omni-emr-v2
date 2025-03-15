
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { NoteTemplate } from '@/types/clinicalNotes';
import NoteSectionEditor from '../components/NoteSectionEditor';
import NoteSectionPreview from '../components/NoteSectionPreview';

interface NoteContentProps {
  activeTab: 'editor' | 'preview';
  template: NoteTemplate;
  sections: { [key: string]: string };
  noteTitle: string;
  handleSectionChange: (sectionTitle: string, content: string) => void;
  requiredFieldsError?: string[];
}

const NoteContent = ({ 
  activeTab, 
  template, 
  sections,
  noteTitle,
  handleSectionChange,
  requiredFieldsError = []
}: NoteContentProps) => {
  return (
    <>
      <TabsContent value="editor" className="space-y-4 mt-2">
        {template.sections.map((section, index) => (
          <NoteSectionEditor
            key={index}
            sectionTitle={section.title}
            content={sections[section.title] || ''}
            onChange={(content) => handleSectionChange(section.title, content)}
            isRequired={section.required}
            hasError={requiredFieldsError.includes(section.title)}
          />
        ))}
      </TabsContent>
      
      <TabsContent value="preview" className="mt-2">
        <div className="prose prose-sm max-w-none">
          <h1>{noteTitle}</h1>
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
