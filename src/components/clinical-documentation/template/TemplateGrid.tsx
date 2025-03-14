
import React from 'react';
import { NoteTemplate } from '@/types/clinicalNotes';
import TemplateCard from './TemplateCard';

interface TemplateGridProps {
  templates: NoteTemplate[];
  onSelectTemplate: (template: NoteTemplate) => void;
}

const TemplateGrid = ({ templates, onSelectTemplate }: TemplateGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard 
          key={template.id} 
          template={template} 
          onSelect={onSelectTemplate} 
        />
      ))}
    </div>
  );
};

export default TemplateGrid;
