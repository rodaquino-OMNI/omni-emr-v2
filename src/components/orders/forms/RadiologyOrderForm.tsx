import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface RadiologyOrderDetails {
  examType: string;
  bodyPart: string;
  laterality?: string;
  contrast?: boolean;
  contrastType?: string;
  clinicalReason: string;
  patientPreparation?: string;
  transportMode?: string;
  priority?: string;
  previousExams?: string;
  pregnancyStatus?: string;
  additionalInstructions?: string;
}

export interface RadiologyOrderFormProps {
  initialData?: Partial<RadiologyOrderDetails>;
  onChange: (data: RadiologyOrderDetails) => void;
  errors?: Record<string, string>;
}

const RadiologyOrderForm: React.FC<RadiologyOrderFormProps> = ({
  initialData,
  onChange,
  errors = {}
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<RadiologyOrderDetails>({
    examType: initialData?.examType || 'xray',
    bodyPart: initialData?.bodyPart || '',
    laterality: initialData?.laterality || 'not_applicable',
    contrast: initialData?.contrast || false,
    contrastType: initialData?.contrastType || '',
    clinicalReason: initialData?.clinicalReason || '',
    patientPreparation: initialData?.patientPreparation || '',
    transportMode: initialData?.transportMode || 'ambulatory',
    priority: initialData?.priority || 'routine',
    previousExams: initialData?.previousExams || '',
    pregnancyStatus: initialData?.pregnancyStatus || 'not_applicable',
    additionalInstructions: initialData?.additionalInstructions || ''
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const examTypes = [
    { value: 'xray', label: t('xray', 'X-Ray') },
    { value: 'ct', label: t('ct', 'CT Scan') },
    { value: 'mri', label: t('mri', 'MRI') },
    { value: 'ultrasound', label: t('ultrasound', 'Ultrasound') },
    { value: 'mammogram', label: t('mammogram', 'Mammogram') },
    { value: 'dexa', label: t('dexa', 'DEXA Scan') },
    { value: 'pet', label: t('pet', 'PET Scan') },
    { value: 'nuclear', label: t('nuclear', 'Nuclear Medicine') },
    { value: 'angiography', label: t('angiography', 'Angiography') },
    { value: 'fluoroscopy', label: t('fluoroscopy', 'Fluoroscopy') }
  ];

  const bodyParts = [
    { value: 'head', label: t('head', 'Head') },
    { value: 'neck', label: t('neck', 'Neck') },
    { value: 'chest', label: t('chest', 'Chest') },
    { value: 'abdomen', label: t('abdomen', 'Abdomen') },
    { value: 'pelvis', label: t('pelvis', 'Pelvis') },
    { value: 'spine', label: t('spine', 'Spine') },
    { value: 'upper_extremity', label: t('upperExtremity', 'Upper Extremity') },
    { value: 'lower_extremity', label: t('lowerExtremity', 'Lower Extremity') },
    { value: 'whole_body', label: t('wholeBody', 'Whole Body') }
  ];

  const lateralities = [
    { value: 'left', label: t('left', 'Left') },
    { value: 'right', label: t('right', 'Right') },
    { value: 'bilateral', label: t('bilateral', 'Bilateral') },
    { value: 'not_applicable', label: t('notApplicable', 'Not Applicable') }
  ];

  const transportModes = [
    { value: 'ambulatory', label: t('ambulatory', 'Ambulatory') },
    { value: 'wheelchair', label: t('wheelchair', 'Wheelchair') },
    { value: 'stretcher', label: t('stretcher', 'Stretcher') },
    { value: 'bed', label: t('bed', 'Hospital Bed') }
  ];

  const priorities = [
    { value: 'routine', label: t('routine', 'Routine') },
    { value: 'urgent', label: t('urgent', 'Urgent') },
    { value: 'stat', label: t('stat', 'STAT') }
  ];

  const pregnancyStatuses = [
    { value: 'not_pregnant', label: t('notPregnant', 'Not Pregnant') },
    { value: 'pregnant', label: t('pregnant', 'Pregnant') },
    { value: 'unknown', label: t('unknown', 'Unknown') },
    { value: 'not_applicable', label: t('notApplicable', 'Not Applicable') }
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="examType">
              {t('examType', 'Exam Type')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.examType}
              onValueChange={(value) => handleSelectChange('examType', value)}
            >
              <SelectTrigger id="examType" className={errors.examType ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('selectExamType', 'Select exam type')} />
              </SelectTrigger>
              <SelectContent>
                {examTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.examType && (
              <p className="text-red-500 text-sm">{errors.examType}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bodyPart">
              {t('bodyPart', 'Body Part')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.bodyPart}
              onValueChange={(value) => handleSelectChange('bodyPart', value)}
            >
              <SelectTrigger id="bodyPart" className={errors.bodyPart ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('selectBodyPart', 'Select body part')} />
              </SelectTrigger>
              <SelectContent>
                {bodyParts.map((part) => (
                  <SelectItem key={part.value} value={part.value}>
                    {part.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bodyPart && (
              <p className="text-red-500 text-sm">{errors.bodyPart}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="laterality">
              {t('laterality', 'Laterality')}
            </Label>
            <Select
              value={formData.laterality}
              onValueChange={(value) => handleSelectChange('laterality', value)}
            >
              <SelectTrigger id="laterality">
                <SelectValue placeholder={t('selectLaterality', 'Select laterality')} />
              </SelectTrigger>
              <SelectContent>
                {lateralities.map((lat) => (
                  <SelectItem key={lat.value} value={lat.value}>
                    {lat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">
              {t('priority', 'Priority')}
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleSelectChange('priority', value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder={t('selectPriority', 'Select priority')} />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="contrast"
              checked={formData.contrast}
              onCheckedChange={(checked) => 
                handleCheckboxChange('contrast', checked === true)
              }
            />
            <Label htmlFor="contrast" className="cursor-pointer">
              {t('contrastRequired', 'Contrast Required')}
            </Label>
          </div>

          {formData.contrast && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="contrastType">
                {t('contrastType', 'Contrast Type')}
              </Label>
              <Input
                id="contrastType"
                name="contrastType"
                value={formData.contrastType}
                onChange={handleInputChange}
                placeholder={t('enterContrastType', 'Enter contrast type')}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="clinicalReason">
              {t('clinicalReason', 'Clinical Reason')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="clinicalReason"
              name="clinicalReason"
              value={formData.clinicalReason}
              onChange={handleInputChange}
              placeholder={t('enterClinicalReason', 'Enter clinical reason for exam')}
              rows={2}
              className={errors.clinicalReason ? 'border-red-500' : ''}
            />
            {errors.clinicalReason && (
              <p className="text-red-500 text-sm">{errors.clinicalReason}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientPreparation">
              {t('patientPreparation', 'Patient Preparation')}
            </Label>
            <Textarea
              id="patientPreparation"
              name="patientPreparation"
              value={formData.patientPreparation}
              onChange={handleInputChange}
              placeholder={t('enterPatientPreparation', 'Enter patient preparation instructions')}
              rows={2}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transportMode">
              {t('transportMode', 'Transport Mode')}
            </Label>
            <Select
              value={formData.transportMode}
              onValueChange={(value) => handleSelectChange('transportMode', value)}
            >
              <SelectTrigger id="transportMode">
                <SelectValue placeholder={t('selectTransportMode', 'Select transport mode')} />
              </SelectTrigger>
              <SelectContent>
                {transportModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pregnancyStatus">
              {t('pregnancyStatus', 'Pregnancy Status')}
            </Label>
            <Select
              value={formData.pregnancyStatus}
              onValueChange={(value) => handleSelectChange('pregnancyStatus', value)}
            >
              <SelectTrigger id="pregnancyStatus">
                <SelectValue placeholder={t('selectPregnancyStatus', 'Select pregnancy status')} />
              </SelectTrigger>
              <SelectContent>
                {pregnancyStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="previousExams">
            {t('previousExams', 'Previous Exams')}
          </Label>
          <Textarea
            id="previousExams"
            name="previousExams"
            value={formData.previousExams}
            onChange={handleInputChange}
            placeholder={t('enterPreviousExams', 'Enter information about previous relevant exams')}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInstructions">
            {t('additionalInstructions', 'Additional Instructions')}
          </Label>
          <Textarea
            id="additionalInstructions"
            name="additionalInstructions"
            value={formData.additionalInstructions}
            onChange={handleInputChange}
            placeholder={t('enterAdditionalInstructions', 'Enter any additional instructions')}
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RadiologyOrderForm;
