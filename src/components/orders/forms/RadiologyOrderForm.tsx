
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
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<RadiologyOrder>>(data || {
    examType: '',
    bodyPart: '',
    contrast: false,
    clinicalReason: '',
    priority: 'routine'
  });
  
  // List of common radiology exam types
  const examTypes = [
    { value: 'x-ray', label: t('xRay') },
    { value: 'ct', label: t('ctScan') },
    { value: 'mri', label: t('mri') },
    { value: 'ultrasound', label: t('ultrasound') },
    { value: 'pet', label: t('petScan') },
    { value: 'mammogram', label: t('mammogram') },
    { value: 'dexa', label: t('dexaScan') },
    { value: 'fluoroscopy', label: t('fluoroscopy') }
  ];
  
  // Body parts based on common anatomical regions
  const bodyParts = [
    { value: 'head', label: t('head') },
    { value: 'neck', label: t('neck') },
    { value: 'chest', label: t('chest') },
    { value: 'abdomen', label: t('abdomen') },
    { value: 'pelvis', label: t('pelvis') },
    { value: 'spine', label: t('spine') },
    { value: 'upper_extremity', label: t('upperExtremity') },
    { value: 'lower_extremity', label: t('lowerExtremity') },
    { value: 'whole_body', label: t('wholeBody') }
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
          {t('examType')}
        </Label>
        <Select
          value={formData.examType || ''}
          onValueChange={(value) => handleInputChange('examType', value)}
        >
          <SelectTrigger id="exam-type">
            <SelectValue placeholder={t('selectExamType')} />
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
          {t('bodyPart')}
        </Label>
        <Select
          value={formData.bodyPart || ''}
          onValueChange={(value) => handleInputChange('bodyPart', value)}
        >
          <SelectTrigger id="body-part">
            <SelectValue placeholder={t('selectBodyPart')} />
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
            {t('useContrast')}
          </Label>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="clinical-reason">
          {t('clinicalReason')}
        </Label>
        <Textarea
          id="clinical-reason"
          placeholder={t('clinicalReasonPlaceholder')}
          value={formData.clinicalReason || ''}
          onChange={(e) => handleInputChange('clinicalReason', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="patient-prep">
          {t('patientPreparation')}
        </Label>
        <Textarea
          id="patient-prep"
          placeholder={t('patientPrepPlaceholder')}
          value={formData.patientPrep || ''}
          onChange={(e) => handleInputChange('patientPrep', e.target.value)}
          rows={2}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {t('priority')}
        </Label>
        <RadioGroup 
          value={formData.priority || "routine"}
          onValueChange={(value: 'routine' | 'urgent' | 'stat') => handleInputChange('priority', value)}
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="routine" id="priority-routine" />
              <Label htmlFor="priority-routine">
                {t('routine')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="priority-urgent" />
              <Label htmlFor="priority-urgent">
                {t('urgent')}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stat" id="priority-stat" />
              <Label htmlFor="priority-stat">
                {t('stat')}
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default RadiologyOrderForm;
