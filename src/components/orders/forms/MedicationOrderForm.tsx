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

export interface MedicationOrderDetails {
  medicationName: string;
  rxnormCode?: string;
  dosage: string;
  frequency: string;
  route: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  instructions?: string;
  refills?: number;
  quantity?: string;
  substitutionAllowed?: boolean;
}

export interface MedicationOrderFormProps {
  initialData?: Partial<MedicationOrderDetails>;
  onChange: (data: MedicationOrderDetails) => void;
  errors?: Record<string, string>;
}

const MedicationOrderForm: React.FC<MedicationOrderFormProps> = ({
  initialData,
  onChange,
  errors = {}
}) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<MedicationOrderDetails>({
    medicationName: initialData?.medicationName || '',
    rxnormCode: initialData?.rxnormCode || '',
    dosage: initialData?.dosage || '',
    frequency: initialData?.frequency || '',
    route: initialData?.route || 'oral',
    duration: initialData?.duration || '',
    startDate: initialData?.startDate || new Date().toISOString(),
    endDate: initialData?.endDate || '',
    instructions: initialData?.instructions || '',
    refills: initialData?.refills || 0,
    quantity: initialData?.quantity || '',
    substitutionAllowed: initialData?.substitutionAllowed ?? true
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

  const handleNumberChange = (name: string, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numValue)) {
      setFormData(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [name]: date ? date.toISOString() : ''
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const routes = [
    { value: 'oral', label: t('oral', 'Oral') },
    { value: 'iv', label: t('iv', 'Intravenous') },
    { value: 'im', label: t('im', 'Intramuscular') },
    { value: 'subcutaneous', label: t('subcutaneous', 'Subcutaneous') },
    { value: 'topical', label: t('topical', 'Topical') },
    { value: 'rectal', label: t('rectal', 'Rectal') },
    { value: 'vaginal', label: t('vaginal', 'Vaginal') },
    { value: 'inhaled', label: t('inhaled', 'Inhaled') },
    { value: 'ophthalmic', label: t('ophthalmic', 'Ophthalmic') },
    { value: 'otic', label: t('otic', 'Otic') },
    { value: 'nasal', label: t('nasal', 'Nasal') },
  ];

  const frequencies = [
    { value: 'once', label: t('once', 'Once') },
    { value: 'daily', label: t('daily', 'Daily') },
    { value: 'bid', label: t('bid', 'Twice daily (BID)') },
    { value: 'tid', label: t('tid', 'Three times daily (TID)') },
    { value: 'qid', label: t('qid', 'Four times daily (QID)') },
    { value: 'q4h', label: t('q4h', 'Every 4 hours') },
    { value: 'q6h', label: t('q6h', 'Every 6 hours') },
    { value: 'q8h', label: t('q8h', 'Every 8 hours') },
    { value: 'q12h', label: t('q12h', 'Every 12 hours') },
    { value: 'weekly', label: t('weekly', 'Weekly') },
    { value: 'monthly', label: t('monthly', 'Monthly') },
    { value: 'prn', label: t('prn', 'As needed (PRN)') },
  ];

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="medicationName">
              {t('medicationName', 'Medication Name')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="medicationName"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleInputChange}
              placeholder={t('enterMedicationName', 'Enter medication name')}
              className={errors.medicationName ? 'border-red-500' : ''}
            />
            {errors.medicationName && (
              <p className="text-red-500 text-sm">{errors.medicationName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">
              {t('dosage', 'Dosage')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleInputChange}
              placeholder={t('enterDosage', 'Enter dosage (e.g., 500mg)')}
              className={errors.dosage ? 'border-red-500' : ''}
            />
            {errors.dosage && (
              <p className="text-red-500 text-sm">{errors.dosage}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">
              {t('frequency', 'Frequency')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => handleSelectChange('frequency', value)}
            >
              <SelectTrigger id="frequency" className={errors.frequency ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('selectFrequency', 'Select frequency')} />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.frequency && (
              <p className="text-red-500 text-sm">{errors.frequency}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="route">
              {t('route', 'Route')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.route}
              onValueChange={(value) => handleSelectChange('route', value)}
            >
              <SelectTrigger id="route" className={errors.route ? 'border-red-500' : ''}>
                <SelectValue placeholder={t('selectRoute', 'Select route')} />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route.value} value={route.value}>
                    {route.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.route && (
              <p className="text-red-500 text-sm">{errors.route}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">
              {t('duration', 'Duration')}
            </Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder={t('enterDuration', 'Enter duration (e.g., 7 days)')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {t('quantity', 'Quantity')}
            </Label>
            <Input
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder={t('enterQuantity', 'Enter quantity (e.g., 30 tablets)')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refills">
              {t('refills', 'Refills')}
            </Label>
            <Input
              id="refills"
              name="refills"
              type="number"
              min="0"
              value={formData.refills}
              onChange={(e) => handleNumberChange('refills', e.target.value)}
              placeholder={t('enterRefills', 'Enter number of refills')}
            />
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">
              {t('startDate', 'Start Date')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? (
                    format(new Date(formData.startDate), 'PPP')
                  ) : (
                    <span>{t('selectStartDate', 'Select start date')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={(date) => handleDateChange('startDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">
              {t('endDate', 'End Date')}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? (
                    format(new Date(formData.endDate), 'PPP')
                  ) : (
                    <span>{t('selectEndDate', 'Select end date')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate ? new Date(formData.endDate) : undefined}
                  onSelect={(date) => handleDateChange('endDate', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">
            {t('instructions', 'Instructions')}
          </Label>
          <Textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            placeholder={t('enterInstructions', 'Enter administration instructions')}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationOrderForm;
