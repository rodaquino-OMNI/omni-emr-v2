
import { useState, useEffect } from 'react';
import { NoteTemplate, NoteType } from '@/types/clinicalNotes';

export const useTemplates = (selectedType?: NoteType) => {
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return {
    templates: filteredTemplates,
    loading
  };
};
