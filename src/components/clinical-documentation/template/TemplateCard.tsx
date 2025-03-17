
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NoteTemplate } from '@/types/clinicalNotes';
import { useTranslation } from '@/hooks/useTranslation';
import { templateIcons } from './TemplateIcons';

interface TemplateCardProps {
  template: NoteTemplate;
  onSelect: (template: NoteTemplate) => void;
}

const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  const { language } = useTranslation();
  
  return (
    <Card 
      className="hover:border-primary hover:shadow-md cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
      onClick={() => onSelect(template)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {templateIcons[template.type]}
          {template.name}
          {template.isDefault && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">
              {language === 'pt' ? 'Padrão' : 'Default'}
            </span>
          )}
        </CardTitle>
        <CardDescription>
          {language === 'pt' ? 'Seções:' : 'Sections:'} {template.sections.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {template.sections.slice(0, 3).map((section, index) => (
            <div key={index} className="mb-1 flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/50"></div>
              <span>{section.title}</span>
              {section.required && (
                <span className="text-xs text-red-500 ml-auto">*</span>
              )}
            </div>
          ))}
          {template.sections.length > 3 && (
            <div className="italic text-muted-foreground/80 mt-2 text-center">
              {language === 'pt' 
                ? `+ ${template.sections.length - 3} mais seções` 
                : `+ ${template.sections.length - 3} more sections`
              }
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
