import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface ConsultationOrderDetails {
  specialtyType: string;
  reason: string;
  urgency: string;
  preferredDate?: string;
  preferredProvider?: string;
  patientHistory?: string;
  relevantFindings?: string;
  questionForConsultant?: string;
  additionalInstructions?: string;
}

export interface ConsultationOrderFormProps {
  initialData?: Partial<ConsultationOrderDetails>;
  onChange: (data: ConsultationOrderDetails) => void;
  errors?: Record<string, string>;
}

const ConsultationOrderForm: React.FC<ConsultationOrderFormProps> = ({
  initialData,
  onChange,
  errors = {}
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<ConsultationOrderDetails>({
    specialtyType: initialData?.specialtyType || '',
    reason: initialData?.reason || '',
    urgency: initialData?.urgency || 'routine',
    preferredDate: initialData?.preferredDate || '',
    preferredProvider: initialData?.preferredProvider || '',
    patientHistory: initialData?.patientHistory || '',
    relevantFindings: initialData?.relevantFindings || '',
    questionForConsultant: initialData?.questionForConsultant || '',
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

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [name]: date ? date.toISOString() : ''
    }));
  };

  const specialties = [
    { value: 'cardiology', label: t('cardiology', 'Cardiology') },
    { value: 'dermatology', label: t('dermatology', 'Dermatology') },
    { value: 'endocrinology', label: t('endocrinology', 'Endocrinology') },
    { value: 'gastroenterology', label: t('gastroenterology', 'Gastroenterology') },
    { value: 'hematology', label: t('hematology', 'Hematology') },
    { value: 'infectious_disease', label: t('infectiousDisease', 'Infectious Disease') },
    { value: 'nephrology', label: t('nephrology', 'Nephrology') },
    { value: 'neurology', label: t('neurology', 'Neurology') },
    { value: 'oncology', label: t('oncology', 'Oncology') },
    { value: 'ophthalmology', label: t('ophthalmology', 'Ophthalmology') },
    { value: 'orthopedics', label: t('orthopedics', 'Orthopedics') },
    { value: 'otolaryngology', label: t('otolaryngology', 'Otolaryngology (ENT)') },
    { value: 'psychiatry', label: t('psychiatry', 'Psychiatry') },
    { value: 'pulmonology', label: t('pulmonology', 'Pulmonology') },
    { value: 'rheumatology', label: t('rheumatology', 'Rheumatology') },
    { value: 'urology', label: t('urology', 'Urology') },
    { value: 'other', label: t('other', 'Other') }
  ];

  const urgencies = [
    { value: 'routine', label: t('routine', 'Routine (Within 2 weeks)') },
    { value: 'urgent', label: t('urgent', 'Urgent (Within 48 hours)') },
    { value: 'emergent', label: t('emergent', 'Emergent (Same day)') }
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="specialtyType">
              {t('specialtyType', 'Specialty')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.specialtyType}
              onValueChange={(value) => handleSelectChange('specialtyType', value)}
            >
              <SelectTrigger id="specialtyType" className={errors.specialtyType ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('selectSpecialty', 'Select specialty')} />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.value} value={specialty.value}>
                    {specialty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.specialtyType && (
              <p className="text-red-500 text-sm">{errors.specialtyType}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="reason">
              {t('reason', 'Reason for Consultation')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder={t('enterReason', 'Enter reason for consultation')}
              rows={2}
              className={errors.reason ? 'border-red-500' : ''}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm">{errors.reason}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">
              {t('urgency', 'Urgency')} <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value) => handleSelectChange('urgency', value)}
              className="flex flex-col space-y-1"
            >
              {urgencies.map((urgency) => (
                <div key={urgency.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={urgency.value} id={`urgency-${urgency.value}`} />
                  <Label htmlFor={`urgency-${urgency.value}`} className="cursor-pointer">
                    {urgency.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.urgency && (
              <p className="text-red-500 text-sm">{errors.urgency}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate">
              {t('preferredDate', 'Preferred Date')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.preferredDate ? (
                    format(new Date(formData.preferredDate), 'PPP')
                  ) : (
                    <span>{t('selectPreferredDate', 'Select preferred date')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.preferredDate ? new Date(formData.preferredDate) : undefined}
                  onSelect={(date) => handleDateChange('preferredDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="preferredProvider">
            {t('preferredProvider', 'Preferred Provider')}
          </Label>
          <Input
            id="preferredProvider"
            name="preferredProvider"
            value={formData.preferredProvider}
            onChange={handleInputChange}
            placeholder={t('enterPreferredProvider', 'Enter preferred provider (if any)')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="patientHistory">
            {t('patientHistory', 'Relevant Patient History')}
          </Label>
          <Textarea
            id="patientHistory"
            name="patientHistory"
            value={formData.patientHistory}
            onChange={handleInputChange}
            placeholder={t('enterPatientHistory', 'Enter relevant patient history')}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="relevantFindings">
            {t('relevantFindings', 'Relevant Findings')}
          </Label>
          <Textarea
            id="relevantFindings"
            name="relevantFindings"
            value={formData.relevantFindings}
            onChange={handleInputChange}
            placeholder={t('enterRelevantFindings', 'Enter relevant physical exam and diagnostic findings')}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="questionForConsultant">
            {t('questionForConsultant', 'Question for Consultant')}
          </Label>
          <Textarea
            id="questionForConsultant"
            name="questionForConsultant"
            value={formData.questionForConsultant}
            onChange={handleInputChange}
            placeholder={t('enterQuestion', 'Enter specific question for the consultant')}
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

export default ConsultationOrderForm;
