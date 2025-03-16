
import { useState, useEffect } from 'react';
import { ClinicalNote, NoteTemplate } from '@/types/clinicalNotes';

export const useNoteContent = (
  template: NoteTemplate,
  existingNote?: ClinicalNote
) => {
  const [sections, setSections] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [requiredFieldsError, setRequiredFieldsError] = useState<string[]>([]);

  useEffect(() => {
    const initialSections: { [key: string]: string } = {};
    template.sections.forEach(section => {
      initialSections[section.title] = existingNote?.content.includes(section.title) 
        ? extractSectionContent(existingNote.content, section.title) 
        : '';
    });
    setSections(initialSections);
  }, [template, existingNote]);

  const extractSectionContent = (content: string, sectionTitle: string) => {
    const regex = new RegExp(`## ${sectionTitle}\\s*([\\s\\S]*?)(?=## |$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
  };

  const compileNoteContent = () => {
    let compiledContent = '';
    template.sections.forEach(section => {
      const sectionContent = sections[section.title] || '';
      compiledContent += `## ${section.title}\n${sectionContent}\n\n`;
    });
    return compiledContent.trim();
  };

  const handleSectionChange = (sectionTitle: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [sectionTitle]: content
    }));
    
    if (requiredFieldsError.includes(sectionTitle)) {
      setRequiredFieldsError(prev => prev.filter(field => field !== sectionTitle));
    }
  };

  return {
    sections,
    activeTab,
    requiredFieldsError,
    setActiveTab,
    setRequiredFieldsError,
    handleSectionChange,
    compileNoteContent
  };
};
