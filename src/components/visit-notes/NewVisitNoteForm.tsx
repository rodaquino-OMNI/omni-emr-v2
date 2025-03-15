
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface NewVisitNoteFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const NewVisitNoteForm = ({ onClose, onSuccess }: NewVisitNoteFormProps) => {
  const { language } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    title: '',
    summary: '',
    status: 'active'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.patientName || !formData.title) {
      toast.error(
        language === 'pt' ? 'Campos obrigatórios' : 'Required fields',
        {
          description: language === 'pt' 
            ? 'Por favor, preencha todos os campos obrigatórios' 
            : 'Please fill in all required fields'
        }
      );
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would save to the database
      // For now we're just simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVisitNote = {
        id: uuidv4(),
        patientId: formData.patientId,
        patientName: formData.patientName,
        date: new Date().toISOString().split('T')[0],
        status: formData.status,
        title: formData.title,
        summary: formData.summary,
        createdBy: user?.name || 'Unknown Provider',
        createdById: user?.id || 'unknown'
      };
      
      // In real implementation, we would save this to Supabase
      console.log('New visit note created:', newVisitNote);
      
      toast.success(
        language === 'pt' ? 'Nota de visita criada' : 'Visit note created',
        {
          description: language === 'pt'
            ? 'A nota de visita foi criada com sucesso'
            : 'The visit note has been created successfully'
        }
      );
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating visit note:', error);
      toast.error(
        language === 'pt' ? 'Erro' : 'Error',
        {
          description: language === 'pt'
            ? 'Ocorreu um erro ao criar a nota de visita'
            : 'An error occurred while creating the visit note'
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {language === 'pt' ? 'Nova Nota de Visita' : 'New Visit Note'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId" className="required">
                {language === 'pt' ? 'ID do Paciente' : 'Patient ID'}
              </Label>
              <Input
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientName" className="required">
                {language === 'pt' ? 'Nome do Paciente' : 'Patient Name'}
              </Label>
              <Input
                id="patientName"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="required">
                {language === 'pt' ? 'Título' : 'Title'}
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">
                {language === 'pt' ? 'Status' : 'Status'}
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={language === 'pt' ? 'Selecionar status' : 'Select status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    {language === 'pt' ? 'Ativo' : 'Active'}
                  </SelectItem>
                  <SelectItem value="discharged">
                    {language === 'pt' ? 'Alta' : 'Discharged'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">
              {language === 'pt' ? 'Resumo' : 'Summary'}
            </Label>
            <Textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={5}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {language === 'pt' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              language === 'pt' ? 'Salvando...' : 'Saving...'
            ) : (
              language === 'pt' ? 'Salvar' : 'Save'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NewVisitNoteForm;
