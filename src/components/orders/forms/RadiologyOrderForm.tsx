
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/useTranslation';
import { RadiologyOrder } from '@/types/orders';

interface RadiologyOrderFormProps {
  onDataChange: (data: Partial<RadiologyOrder>) => void;
  data?: Partial<RadiologyOrder>;
}

const RadiologyOrderForm = ({ onDataChange, data }: RadiologyOrderFormProps) => {
  const { language } = useTranslation();
  const [formData, setFormData] = useState<Partial<RadiologyOrder>>(data || {
    examType: '',
    bodyPart: '',
    contrast: false,
    clinicalReason: '',
    priority: 'routine'
  });
  
  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);
  
  const handleInputChange = (field: keyof RadiologyOrder, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="exam-type">
            {language === 'pt' ? 'Tipo de Exame' : 'Exam Type'}
          </Label>
          <Input
            id="exam-type"
            placeholder={language === 'pt' ? 'Ex: Raio-X, Tomografia' : 'Ex: X-Ray, CT Scan'}
            value={formData.examType || ''}
            onChange={(e) => handleInputChange('examType', e.target.value)}
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="body-part">
            {language === 'pt' ? 'Parte do Corpo' : 'Body Part'}
          </Label>
          <Input
            id="body-part"
            placeholder={language === 'pt' ? 'Ex: Tórax, Abdômen' : 'Ex: Chest, Abdomen'}
            value={formData.bodyPart || ''}
            onChange={(e) => handleInputChange('bodyPart', e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="contrast"
          checked={formData.contrast || false}
          onCheckedChange={(checked) => handleInputChange('contrast', checked)}
        />
        <Label htmlFor="contrast">
          {language === 'pt' ? 'Com Contraste' : 'With Contrast'}
        </Label>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="clinical-reason">
          {language === 'pt' ? 'Razão Clínica' : 'Clinical Reason'}
        </Label>
        <Textarea
          id="clinical-reason"
          placeholder={language === 'pt' ? 'Motivo clínico do exame...' : 'Clinical reason for the exam...'}
          value={formData.clinicalReason || ''}
          onChange={(e) => handleInputChange('clinicalReason', e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="patient-prep">
          {language === 'pt' ? 'Preparo do Paciente' : 'Patient Preparation'}
        </Label>
        <Textarea
          id="patient-prep"
          placeholder={language === 'pt' ? 'Instruções para o paciente...' : 'Instructions for the patient...'}
          value={formData.patientPrep || ''}
          onChange={(e) => handleInputChange('patientPrep', e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Prioridade' : 'Priority'}
        </Label>
        <RadioGroup 
          value={formData.priority || "routine"}
          onValueChange={(value: 'routine' | 'urgent' | 'stat') => handleInputChange('priority', value)}
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="routine" id="priority-routine" />
              <Label htmlFor="priority-routine">
                {language === 'pt' ? 'Rotina' : 'Routine'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="priority-urgent" />
              <Label htmlFor="priority-urgent">
                {language === 'pt' ? 'Urgente' : 'Urgent'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stat" id="priority-stat" />
              <Label htmlFor="priority-stat">
                {language === 'pt' ? 'Imediato' : 'STAT'}
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default RadiologyOrderForm;
