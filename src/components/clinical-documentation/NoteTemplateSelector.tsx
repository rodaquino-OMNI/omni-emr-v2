
import React from 'react';
import { NoteTemplate, NoteType } from '@/types/clinicalNotes';
import { useTemplates } from './hooks/useTemplates';
import NoteTypeFilters from './template/NoteTypeFilters';
import TemplateGrid from './template/TemplateGrid';

interface NoteTemplateSelectorProps {
  onSelectTemplate: (template: NoteTemplate) => void;
  selectedType?: NoteType;
  onTypeChange?: (type: NoteType) => void;
}

const NoteTemplateSelector = ({ 
  onSelectTemplate, 
  selectedType, 
  onTypeChange 
}: NoteTemplateSelectorProps) => {
  const { templates, loading } = useTemplates(selectedType);
  
  return (
    <div className="space-y-6">
      {onTypeChange && (
        <NoteTypeFilters 
          selectedType={selectedType} 
          onTypeChange={onTypeChange} 
        />
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <TemplateGrid 
          templates={templates} 
          onSelectTemplate={onSelectTemplate} 
        />
      )}
    </div>
  );
};

export default NoteTemplateSelector;
