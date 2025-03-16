
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
import { ArrowLeft, Save } from 'lucide-react';
import { recordService } from '@/services/recordService';
import { ClinicalDocumentationFormData, RecordTypeOption } from '@/types/medicalRecordTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const [patientName, setPatientName] = useState(language === 'pt' ? 'Carregando...' : 'Loading...');
  const [isLoading, setIsLoading] = useState(false);

  const recordTypes: RecordTypeOption[] = [
    { value: 'lab', label: language === 'pt' ? 'Resultados de Laboratório' : 'Lab Results' },
    { value: 'imaging', label: language === 'pt' ? 'Imagens' : 'Imaging' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimentos' : 'Procedures' },
    { value: 'visit', label: language === 'pt' ? 'Notas de Visita' : 'Visit Notes' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' },
  ];

  useEffect(() => {
    // If we have a patient ID, fetch patient info
    if (patientId) {
      const fetchPatient = async () => {
        try {
          // In a real application, this would fetch the patient's name
          // For now, we'll simulate it
          setPatientName('Patient Name');
          setFormData(prev => ({ ...prev, patientId }));
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      };
      
      fetchPatient();
    }
    
    // If we have a record ID, fetch the record for editing
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
            
            // Also fetch the patient name
            setPatientName('Patient Name');
          }
        } catch (error) {
          console.error('Error fetching record:', error);
        }
      };
      
      fetchRecord();
    }
  }, [id, patientId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value as any }));
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
      const record = {
        title: formData.title,
        type: formData.type,
        patientId: formData.patientId,
        date: new Date().toISOString(),
        provider: user?.name || 'Unknown Provider',
        status: 'completed',
        content: formData.content,
        notes: formData.notes
      };
      
      let result;
      
      if (id) {
        // Update existing record
        result = await recordService.updateRecord(id, record);
      } else {
        // Create new record
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

  return (
    <div className="container mx-auto mt-8 p-4">
      <Button variant="ghost" onClick={() => navigate('/records')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {language === 'pt' ? 'Voltar' : 'Back'}
      </Button>

      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
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
