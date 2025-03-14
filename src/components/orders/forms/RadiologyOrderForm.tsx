
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  
  // List of common radiology exam types
  const examTypes = [
    { value: 'x-ray', label: language === 'pt' ? 'Raio-X' : 'X-Ray' },
    { value: 'ct', label: language === 'pt' ? 'Tomografia Computadorizada' : 'CT Scan' },
    { value: 'mri', label: language === 'pt' ? 'Ressonância Magnética' : 'MRI' },
    { value: 'ultrasound', label: language === 'pt' ? 'Ultrassom' : 'Ultrasound' },
    { value: 'pet', label: language === 'pt' ? 'PET Scan' : 'PET Scan' },
    { value: 'mammogram', label: language === 'pt' ? 'Mamografia' : 'Mammogram' },
    { value: 'dexa', label: language === 'pt' ? 'Densitometria Óssea' : 'DEXA Scan' },
    { value: 'fluoroscopy', label: language === 'pt' ? 'Fluoroscopia' : 'Fluoroscopy' }
  ];
  
  // Body parts based on common anatomical regions
  const bodyParts = [
    { value: 'head', label: language === 'pt' ? 'Cabeça' : 'Head' },
    { value: 'neck', label: language === 'pt' ? 'Pescoço' : 'Neck' },
    { value: 'chest', label: language === 'pt' ? 'Tórax' : 'Chest' },
    { value: 'abdomen', label: language === 'pt' ? 'Abdômen' : 'Abdomen' },
    { value: 'pelvis', label: language === 'pt' ? 'Pelve' : 'Pelvis' },
    { value: 'spine', label: language === 'pt' ? 'Coluna' : 'Spine' },
    { value: 'upper_extremity', label: language === 'pt' ? 'Membros Superiores' : 'Upper Extremity' },
    { value: 'lower_extremity', label: language === 'pt' ? 'Membros Inferiores' : 'Lower Extremity' },
    { value: 'whole_body', label: language === 'pt' ? 'Corpo Inteiro' : 'Whole Body' }
  ];
  
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
      <div className="space-y-1.5">
        <Label htmlFor="exam-type">
          {language === 'pt' ? 'Tipo de Exame' : 'Exam Type'}
        </Label>
        <Select
          value={formData.examType || ''}
          onValueChange={(value) => handleInputChange('examType', value)}
        >
          <SelectTrigger id="exam-type">
            <SelectValue placeholder={language === 'pt' ? 'Selecionar tipo de exame' : 'Select exam type'} />
          </SelectTrigger>
          <SelectContent>
            {examTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="body-part">
          {language === 'pt' ? 'Parte do Corpo' : 'Body Part'}
        </Label>
        <Select
          value={formData.bodyPart || ''}
          onValueChange={(value) => handleInputChange('bodyPart', value)}
        >
          <SelectTrigger id="body-part">
            <SelectValue placeholder={language === 'pt' ? 'Selecionar parte do corpo' : 'Select body part'} />
          </SelectTrigger>
          <SelectContent>
            {bodyParts.map((part) => (
              <SelectItem key={part.value} value={part.value}>
                {part.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="contrast" 
            checked={formData.contrast}
            onCheckedChange={(checked) => handleInputChange('contrast', checked)}
          />
          <Label htmlFor="contrast">
            {language === 'pt' ? 'Usar Contraste' : 'Use Contrast'}
          </Label>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="clinical-reason">
          {language === 'pt' ? 'Justificativa Clínica' : 'Clinical Reason'}
        </Label>
        <Textarea
          id="clinical-reason"
          placeholder={language === 'pt' ? 'Justificativa para este exame...' : 'Reason for this exam...'}
          value={formData.clinicalReason || ''}
          onChange={(e) => handleInputChange('clinicalReason', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="patient-prep">
          {language === 'pt' ? 'Preparação do Paciente' : 'Patient Preparation'}
        </Label>
        <Textarea
          id="patient-prep"
          placeholder={language === 'pt' ? 'Instruções para preparo do paciente...' : 'Instructions for patient preparation...'}
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
