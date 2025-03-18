import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { ArrowLeft, Save, ClipboardList, Image, ArrowUpCircle } from 'lucide-react';
import { recordService } from '@/services/recordService';
import { ClinicalDocumentationFormData, RecordTypeOption, RecordStatus } from '@/types/medicalRecordTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TemplateSelector, { DocumentationTemplate } from '@/components/clinical-documentation/TemplateSelector';
import { useQuery } from '@tanstack/react-query';
import NoteSectionEditor from '@/components/clinical-documentation/components/NoteSectionEditor';

const documentTemplates: DocumentationTemplate[] = [
  {
    id: 'soap',
    name: 'SOAP Note',
    description: 'Standard SOAP format for visit documentation',
    category: 'Visit Notes',
    sections: ['Subjective', 'Objective', 'Assessment', 'Plan'],
    isDefault: true
  },
  {
    id: 'progress',
    name: 'Progress Note',
    description: 'Daily progress documentation',
    category: 'Visit Notes',
    sections: ['Status', 'Interventions', 'Response', 'Plan']
  },
  {
    id: 'discharge',
    name: 'Discharge Summary',
    description: 'Complete discharge documentation',
    category: 'Discharge',
    sections: ['Admission Summary', 'Hospital Course', 'Discharge Medications', 'Follow-up Instructions']
  },
  {
    id: 'consultation',
    name: 'Consultation Note',
    description: 'Specialist consultation findings',
    category: 'Consultations',
    sections: ['Reason for Consultation', 'Findings', 'Impression', 'Recommendations']
  }
];

const ClinicalDocumentation = () => {
  const { id, patientId } = useParams<{ id?: string; patientId?: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user } = useAuth();

  const [formData, setFormData] = useState<ClinicalDocumentationFormData>({
    title: '',
    type: 'visit',
    patientId: patientId || '',
    content: '',
    notes: ''
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [sections, setSections] = useState<Record<string, string>>({});
  const [patientName, setPatientName] = useState(language === 'pt' ? 'Carregando...' : 'Loading...');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const recordTypes: RecordTypeOption[] = [
    { value: 'lab', label: language === 'pt' ? 'Resultados de Laboratório' : 'Lab Results' },
    { value: 'imaging', label: language === 'pt' ? 'Imagens' : 'Imaging' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimentos' : 'Procedures' },
    { value: 'visit', label: language === 'pt' ? 'Notas de Visita' : 'Visit Notes' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' },
  ];

  const { data: patient } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      return { name: 'Patient Name' };
    },
    enabled: !!patientId
  });

  useEffect(() => {
    if (patient) {
      setPatientName(patient.name);
      setFormData(prev => ({ ...prev, patientId: patientId || '' }));
    }
  }, [patient, patientId]);
    
  useEffect(() => {
    if (id) {
      const fetchRecord = async () => {
        try {
          const record = await recordService.getRecordById(id);
          
          if (record) {
            setFormData({
              title: record.title,
              type: record.type,
              patientId: record.patientId,
              content: record.content || '',
              notes: record.notes || ''
            });
            
            setPatientName('Patient Name');
          }
        } catch (error) {
          console.error('Error fetching record:', error);
        }
      };
      
      fetchRecord();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as any }));
  };
  
  const handleSectionChange = (sectionTitle: string, content: string) => {
    setSections(prev => ({ ...prev, [sectionTitle]: content }));
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    
    const template = documentTemplates.find(t => t.id === templateId);
    if (template) {
      const newSections: Record<string, string> = {};
      template.sections.forEach(section => {
        newSections[section] = '';
      });
      setSections(newSections);
      
      setFormData(prev => ({
        ...prev,
        title: template.name
      }));
    }
  };

  const compileContent = () => {
    let compiledContent = '';
    
    if (Object.keys(sections).length > 0) {
      Object.entries(sections).forEach(([section, content]) => {
        compiledContent += `## ${section}\n${content}\n\n`;
      });
    } else {
      compiledContent = formData.content;
    }
    
    return compiledContent;
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error(
        language === 'pt' ? 'O título é obrigatório' : 'Title is required'
      );
      return;
    }
    
    if (!formData.patientId) {
      toast.error(
        language === 'pt' ? 'ID do paciente é obrigatório' : 'Patient ID is required'
      );
      return;
    }
    
    setIsLoading(true);
    try {
      const compiledContent = compileContent();
      
      const record = {
        title: formData.title,
        type: formData.type,
        patientId: formData.patientId,
        date: new Date().toISOString(),
        provider: user?.name || 'Unknown Provider',
        status: 'completed' as RecordStatus,
        content: compiledContent,
        notes: formData.notes,
        media: uploadedImages,
        templateId: selectedTemplate || undefined
      };
      
      let result;
      
      if (id) {
        result = await recordService.updateRecord(id, record);
      } else {
        result = await recordService.createRecord(record);
      }
      
      if (result) {
        toast.success(
          id
            ? (language === 'pt' ? 'Registro atualizado com sucesso' : 'Record updated successfully')
            : (language === 'pt' ? 'Registro criado com sucesso' : 'Record created successfully')
        );
        navigate('/records');
      } else {
        throw new Error('Failed to save record');
      }
    } catch (error) {
      console.error("Error saving record:", error);
      toast.error(
        language === 'pt' 
          ? 'Falha ao salvar o registro. Tente novamente.' 
          : 'Failed to save the record. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedImages(prev => [...prev, URL.createObjectURL(event.target.files![0])]);
      
      event.target.value = '';
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <Button variant="ghost" onClick={() => navigate('/records')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {language === 'pt' ? 'Voltar' : 'Back'}
      </Button>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">
                {id 
                  ? (language === 'pt' ? 'Editar Documentação Clínica' : 'Edit Clinical Documentation')
                  : (language === 'pt' ? 'Nova Documentação Clínica' : 'New Clinical Documentation')
                }
              </h2>
              <p className="text-muted-foreground">
                {language === 'pt' 
                  ? 'Documentar detalhes e observações do paciente.' 
                  : 'Document patient details and observations.'}
              </p>
            </div>
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4 mr-1" />
                  {language === 'pt' ? 'Usar Modelo' : 'Use Template'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <TemplateSelector 
                  templates={documentTemplates} 
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={handleSelectTemplate}
                  onClose={() => setIsTemplateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientId">
                {language === 'pt' ? 'ID do Paciente' : 'Patient ID'}
              </Label>
              <Input
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                disabled={!!patientId}
                required
              />
            </div>
            <div>
              <Label htmlFor="patientName">
                {language === 'pt' ? 'Nome do Paciente' : 'Patient Name'}
              </Label>
              <Input
                id="patientName"
                value={patientName}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">
                {language === 'pt' ? 'Título' : 'Title'}
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={
                  language === 'pt' 
                    ? "Ex: Exame físico inicial" 
                    : "Ex: Initial physical examination"
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="type">
                {language === 'pt' ? 'Tipo de Registro' : 'Record Type'}
              </Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    language === 'pt' 
                      ? "Selecione o tipo de registro" 
                      : "Select record type"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedTemplate && Object.keys(sections).length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">
                {language === 'pt' ? 'Seções do Documento' : 'Document Sections'}
              </h3>
              
              {Object.entries(sections).map(([sectionTitle, content]) => (
                <NoteSectionEditor
                  key={sectionTitle}
                  sectionTitle={sectionTitle}
                  content={content}
                  onChange={(newContent) => handleSectionChange(sectionTitle, newContent)}
                />
              ))}
            </div>
          ) : (
            <div>
              <Label htmlFor="content">
                {language === 'pt' ? 'Conteúdo' : 'Content'}
              </Label>
              <Textarea
                id="content"
                name="content"
                rows={8}
                value={formData.content}
                onChange={handleInputChange}
                placeholder={
                  language === 'pt' 
                    ? "Digite o conteúdo principal do documento clínico aqui..." 
                    : "Enter the main content of the clinical document here..."
                }
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="images">
              {language === 'pt' ? 'Adicionar Imagens' : 'Add Images'}
            </Label>
            <div className="flex items-center gap-2">
              <Label 
                htmlFor="image-upload" 
                className="flex items-center gap-1 px-3 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
              >
                <Image className="h-4 w-4" />
                {language === 'pt' ? 'Escolher arquivo' : 'Choose file'}
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt="Uploaded" className="w-full h-24 object-cover rounded-md" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white"
                      onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="notes">
              {language === 'pt' ? 'Observações Adicionais' : 'Additional Notes'}
            </Label>
            <Textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes || ''}
              onChange={handleInputChange}
              placeholder={
                language === 'pt' 
                  ? "Informações complementares, instruções de acompanhamento, etc." 
                  : "Additional information, follow-up instructions, etc."
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={() => navigate('/records')}
              disabled={isLoading}
            >
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              {isLoading ? (
                language === 'pt' ? 'Salvando...' : 'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1" />
                  {language === 'pt' ? 'Salvar' : 'Save'}
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClinicalDocumentation;
