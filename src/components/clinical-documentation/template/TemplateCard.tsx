
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
      className="hover:border-primary cursor-pointer transition-all"
      onClick={() => onSelect(template)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {templateIcons[template.type]}
          {template.name}
        </CardTitle>
        <CardDescription>
          {language === 'pt' ? 'Seções:' : 'Sections:'} {template.sections.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          {template.sections.slice(0, 3).map((section, index) => (
            <div key={index} className="mb-1">• {section.title}</div>
          ))}
          {template.sections.length > 3 && (
            <div className="italic">
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
