
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FilePlus, FileEdit, FileCheck, FileX } from 'lucide-react';
import { NoteTemplate, NoteType } from '@/types/clinicalNotes';
import { useTranslation } from '@/hooks/useTranslation';

const templateIcons = {
  progress: <FileText className="h-5 w-5 text-blue-500" />,
  admission: <FilePlus className="h-5 w-5 text-purple-500" />,
  consultation: <FileEdit className="h-5 w-5 text-green-500" />,
  procedure: <FileCheck className="h-5 w-5 text-amber-500" />,
  discharge: <FileX className="h-5 w-5 text-red-500" />
};

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
  const { language } = useTranslation();
  const [templates, setTemplates] = React.useState<NoteTemplate[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Mock API call to get templates
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        // This would be an API call in a real app
        const mockTemplates: NoteTemplate[] = [
          {
            id: '1',
            type: 'progress',
            name: 'Standard Progress Note',
            isDefault: true,
            template: '',
            sections: [
              { title: 'Subjective', content: '', required: true },
              { title: 'Objective', content: '', required: true },
              { title: 'Assessment', content: '', required: true },
              { title: 'Plan', content: '', required: true }
            ]
          },
          {
            id: '2',
            type: 'admission',
            name: 'Hospital Admission Note',
            isDefault: true,
            template: '',
            sections: [
              { title: 'Chief Complaint', content: '', required: true },
              { title: 'History of Present Illness', content: '', required: true },
              { title: 'Past Medical History', content: '', required: true },
              { title: 'Medications', content: '', required: true },
              { title: 'Allergies', content: '', required: true },
              { title: 'Review of Systems', content: '', required: true },
              { title: 'Physical Examination', content: '', required: true },
              { title: 'Assessment', content: '', required: true },
              { title: 'Plan', content: '', required: true }
            ]
          },
          {
            id: '3',
            type: 'consultation',
            name: 'Specialist Consultation',
            isDefault: true,
            template: '',
            sections: [
              { title: 'Reason for Consultation', content: '', required: true },
              { title: 'History', content: '', required: true },
              { title: 'Examination', content: '', required: true },
              { title: 'Impression', content: '', required: true },
              { title: 'Recommendations', content: '', required: true }
            ]
          },
          {
            id: '4',
            type: 'procedure',
            name: 'Procedure Note',
            isDefault: true,
            template: '',
            sections: [
              { title: 'Procedure Performed', content: '', required: true },
              { title: 'Indication', content: '', required: true },
              { title: 'Procedure Description', content: '', required: true },
              { title: 'Findings', content: '', required: true },
              { title: 'Complications', content: '', required: true },
              { title: 'Post-procedure Plan', content: '', required: true }
            ]
          },
          {
            id: '5',
            type: 'discharge',
            name: 'Discharge Summary',
            isDefault: true,
            template: '',
            sections: [
              { title: 'Admission Date', content: '', required: true },
              { title: 'Discharge Date', content: '', required: true },
              { title: 'Admission Diagnosis', content: '', required: true },
              { title: 'Discharge Diagnosis', content: '', required: true },
              { title: 'Hospital Course', content: '', required: true },
              { title: 'Medications at Discharge', content: '', required: true },
              { title: 'Follow-up Instructions', content: '', required: true }
            ]
          }
        ];
        
        setTemplates(mockTemplates);
      } catch (error) {
        console.error('Error fetching templates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);

  const filteredTemplates = selectedType 
    ? templates.filter(template => template.type === selectedType)
    : templates;

  const noteTypes: { value: NoteType, label: string }[] = [
    { value: 'progress', label: language === 'pt' ? 'Nota de Evolução' : 'Progress Note' },
    { value: 'admission', label: language === 'pt' ? 'Nota de Admissão' : 'Admission Note' },
    { value: 'consultation', label: language === 'pt' ? 'Consulta' : 'Consultation' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimento' : 'Procedure Note' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' }
  ];

  return (
    <div className="space-y-6">
      {onTypeChange && (
        <div className="flex flex-wrap gap-2">
          {noteTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={() => onTypeChange(type.value)}
            >
              {templateIcons[type.value]}
              {type.label}
            </Button>
          ))}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="hover:border-primary cursor-pointer transition-all"
              onClick={() => onSelectTemplate(template)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteTemplateSelector;
