
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { ConsultationOrder } from '@/types/orders';

interface ConsultationOrderFormProps {
  onDataChange: (data: Partial<ConsultationOrder>) => void;
  data?: Partial<ConsultationOrder>;
}

const ConsultationOrderForm = ({ onDataChange, data }: ConsultationOrderFormProps) => {
  const { language } = useTranslation();
  const [formData, setFormData] = useState<Partial<ConsultationOrder>>(data || {
    specialtyType: '',
    reason: '',
    urgency: 'routine',
    priority: 'routine'
  });
  
  // List of medical specialties
  const specialties = [
    { value: 'cardiology', label: language === 'pt' ? 'Cardiologia' : 'Cardiology' },
    { value: 'dermatology', label: language === 'pt' ? 'Dermatologia' : 'Dermatology' },
    { value: 'endocrinology', label: language === 'pt' ? 'Endocrinologia' : 'Endocrinology' },
    { value: 'gastroenterology', label: language === 'pt' ? 'Gastroenterologia' : 'Gastroenterology' },
    { value: 'neurology', label: language === 'pt' ? 'Neurologia' : 'Neurology' },
    { value: 'oncology', label: language === 'pt' ? 'Oncologia' : 'Oncology' },
    { value: 'orthopedics', label: language === 'pt' ? 'Ortopedia' : 'Orthopedics' },
    { value: 'psychiatry', label: language === 'pt' ? 'Psiquiatria' : 'Psychiatry' },
    { value: 'pulmonology', label: language === 'pt' ? 'Pneumologia' : 'Pulmonology' },
    { value: 'rheumatology', label: language === 'pt' ? 'Reumatologia' : 'Rheumatology' },
  ];
  
  useEffect(() => {
    onDataChange(formData);
  }, [formData, onDataChange]);
  
  const handleInputChange = (field: keyof ConsultationOrder, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="specialty-type">
          {language === 'pt' ? 'Especialidade' : 'Specialty'}
        </Label>
        <Select
          value={formData.specialtyType || ''}
          onValueChange={(value) => handleInputChange('specialtyType', value)}
        >
          <SelectTrigger id="specialty-type">
            <SelectValue placeholder={language === 'pt' ? 'Selecionar especialidade' : 'Select specialty'} />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.value} value={specialty.value}>
                {specialty.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="reason">
          {language === 'pt' ? 'Motivo da Consulta' : 'Reason for Consultation'}
        </Label>
        <Textarea
          id="reason"
          placeholder={language === 'pt' ? 'Descreva o motivo para esta consulta...' : 'Describe the reason for this consultation...'}
          value={formData.reason || ''}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Urgência' : 'Urgency'}
        </Label>
        <RadioGroup 
          value={formData.urgency || "routine"}
          onValueChange={(value: 'routine' | 'urgent' | 'stat') => {
            handleInputChange('urgency', value);
            handleInputChange('priority', value); // Sync priority with urgency
          }}
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="routine" id="urgency-routine" />
              <Label htmlFor="urgency-routine">
                {language === 'pt' ? 'Rotina' : 'Routine'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="urgency-urgent" />
              <Label htmlFor="urgency-urgent">
                {language === 'pt' ? 'Urgente' : 'Urgent'}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stat" id="urgency-stat" />
              <Label htmlFor="urgency-stat">
                {language === 'pt' ? 'Imediato' : 'STAT'}
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="additional-info">
          {language === 'pt' ? 'Informações Adicionais' : 'Additional Information'}
        </Label>
        <Textarea
          id="additional-info"
          placeholder={language === 'pt' ? 'Informações adicionais relevantes...' : 'Relevant additional information...'}
          value={formData.additionalInfo || ''}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default ConsultationOrderForm;
