
import React from 'react';
import { NoteTemplate, NoteType } from '@/types/clinicalNotes';
import { useTemplates } from './hooks/useTemplates';
import NoteTypeFilters from './template/NoteTypeFilters';
import TemplateGrid from './template/TemplateGrid';
import { useAuth } from '@/context/AuthContext';
import { useRoleBasedDashboard } from '@/hooks/useRoleBasedDashboard';

interface NoteTemplateSelectorProps {
  onSelectTemplate: (template: NoteTemplate) => void;
  selectedType?: NoteType;
  onTypeChange?: (type: NoteType) => void;
}

interface SectionType {
  title: string;
  content: string;
  required?: boolean;
}

const NoteTemplateSelector = ({ 
  onSelectTemplate, 
  selectedType, 
  onTypeChange 
}: NoteTemplateSelectorProps) => {
  const { user } = useAuth();
  const { getClinicalTemplates } = useRoleBasedDashboard();
  const { templates: fetchedTemplates, loading } = useTemplates(selectedType);
  const [templates, setTemplates] = React.useState<NoteTemplate[]>(fetchedTemplates);
  
  // Merge fetched templates with role-based templates
  React.useEffect(() => {
    const roleBasedTemplates = getClinicalTemplates();
    
    // Convert role-based templates to the NoteTemplate format
    const convertedTemplates: NoteTemplate[] = roleBasedTemplates.map(template => ({
      id: template.id,
      type: (template.id === 'soap' || template.id === 'progress') ? 'progress' :
            template.id === 'discharge' ? 'discharge' :
            template.id === 'consultation' ? 'consultation' :
            template.id === 'procedure' ? 'procedure' : 'progress',
      name: template.name,
      isDefault: template.isDefault || false,
      template: "",
      sections: template.sections.map((section: string | { title: string, required?: boolean }) => ({
        title: typeof section === 'string' ? section : section.title,
        content: "",
        required: typeof section === 'string' ? false : section.required || false
      }))
    }));
    
    // Combine fetched templates with role-based templates, prioritizing fetched ones
    const combinedTemplates = [...fetchedTemplates];
    
    // Only add role-based templates that don't already exist
    convertedTemplates.forEach(roleTemplate => {
      if (!combinedTemplates.some(t => t.id === roleTemplate.id)) {
        combinedTemplates.push(roleTemplate);
      }
    });
    
    setTemplates(combinedTemplates);
  }, [fetchedTemplates, getClinicalTemplates]);
  
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
