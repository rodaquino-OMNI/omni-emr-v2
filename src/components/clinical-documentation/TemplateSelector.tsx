
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

export interface DocumentationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: string[];
  createdBy?: string;
  isDefault?: boolean;
}

interface TemplateSelectorProps {
  templates: DocumentationTemplate[];
  selectedTemplate?: string;
  onSelectTemplate: (templateId: string) => void;
  onClose: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onClose
}) => {
  const { t, language } = useTranslation();
  const [selected, setSelected] = useState<string>(selectedTemplate || '');

  // Group templates by category
  const templatesByCategory: Record<string, DocumentationTemplate[]> = {};
  templates.forEach(template => {
    if (!templatesByCategory[template.category]) {
      templatesByCategory[template.category] = [];
    }
    templatesByCategory[template.category].push(template);
  });

  const handleSelect = () => {
    if (selected) {
      onSelectTemplate(selected);
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Selecionar Modelo' : 'Select Template'}
      </h2>
      
      {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-md font-medium">{category}</h3>
          <RadioGroup value={selected} onValueChange={setSelected} className="space-y-2">
            {categoryTemplates.map(template => (
              <Card key={template.id} className={`cursor-pointer transition-colors ${selected === template.id ? 'border-primary' : ''}`} onClick={() => setSelected(template.id)}>
                <CardHeader className="p-3 pb-1">
                  <div className="flex items-start">
                    <RadioGroupItem value={template.id} id={template.id} className="mt-1 mr-2" />
                    <div>
                      <Label htmlFor={template.id} className="font-medium text-base cursor-pointer">
                        {template.name}
                        {template.isDefault && (
                          <span className="ml-2 text-xs font-normal text-muted-foreground">{t('default')}</span>
                        )}
                      </Label>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
                    {template.sections.map((section, index) => (
                      <span key={index} className="bg-secondary/30 px-2 py-0.5 rounded">
                        {section}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </div>
      ))}
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose}>
          {language === 'pt' ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button onClick={handleSelect} disabled={!selected}>
          {language === 'pt' ? 'Usar Modelo' : 'Use Template'}
        </Button>
      </div>
    </div>
  );
};

export default TemplateSelector;
