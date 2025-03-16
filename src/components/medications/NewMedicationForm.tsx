
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { Textarea } from '@/components/ui/textarea';

interface NewMedicationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const NewMedicationForm: React.FC<NewMedicationFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const { language } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    route: '',
    instructions: '',
    startDate: '',
    endDate: '',
    status: 'active',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      route: '',
      instructions: '',
      startDate: '',
      endDate: '',
      status: 'active',
    });
  };

  const frequencyOptions = [
    { value: 'once_daily', label: language === 'pt' ? 'Uma vez ao dia' : 'Once daily' },
    { value: 'twice_daily', label: language === 'pt' ? 'Duas vezes ao dia' : 'Twice daily' },
    { value: 'three_times_daily', label: language === 'pt' ? 'Três vezes ao dia' : 'Three times daily' },
    { value: 'four_times_daily', label: language === 'pt' ? 'Quatro vezes ao dia' : 'Four times daily' },
    { value: 'every_morning', label: language === 'pt' ? 'Toda manhã' : 'Every morning' },
    { value: 'every_evening', label: language === 'pt' ? 'Toda noite' : 'Every evening' },
    { value: 'as_needed', label: language === 'pt' ? 'Conforme necessário' : 'As needed' },
  ];

  const routeOptions = [
    { value: 'oral', label: language === 'pt' ? 'Oral' : 'Oral' },
    { value: 'intravenous', label: language === 'pt' ? 'Intravenoso' : 'Intravenous' },
    { value: 'intramuscular', label: language === 'pt' ? 'Intramuscular' : 'Intramuscular' },
    { value: 'subcutaneous', label: language === 'pt' ? 'Subcutâneo' : 'Subcutaneous' },
    { value: 'topical', label: language === 'pt' ? 'Tópico' : 'Topical' },
    { value: 'rectal', label: language === 'pt' ? 'Retal' : 'Rectal' },
    { value: 'inhaled', label: language === 'pt' ? 'Inalado' : 'Inhaled' },
  ];

  const statusOptions = [
    { value: 'active', label: language === 'pt' ? 'Ativo' : 'Active' },
    { value: 'scheduled', label: language === 'pt' ? 'Agendado' : 'Scheduled' },
    { value: 'discontinued', label: language === 'pt' ? 'Descontinuado' : 'Discontinued' },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {language === 'pt' ? 'Novo Medicamento' : 'New Medication'}
          </SheetTitle>
          <SheetDescription>
            {language === 'pt'
              ? 'Adicione um novo medicamento ao sistema.'
              : 'Add a new medication to the system.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              {language === 'pt' ? 'Nome do Medicamento' : 'Medication Name'}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">
              {language === 'pt' ? 'Dosagem' : 'Dosage'}
            </Label>
            <Input
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">
              {language === 'pt' ? 'Frequência' : 'Frequency'}
            </Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => handleSelectChange('frequency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'pt' ? 'Selecionar frequência' : 'Select frequency'} />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="route">
              {language === 'pt' ? 'Via de Administração' : 'Route'}
            </Label>
            <Select
              value={formData.route}
              onValueChange={(value) => handleSelectChange('route', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'pt' ? 'Selecionar via' : 'Select route'} />
              </SelectTrigger>
              <SelectContent>
                {routeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                {language === 'pt' ? 'Data de Início' : 'Start Date'}
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">
                {language === 'pt' ? 'Data de Término' : 'End Date'}
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
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
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">
              {language === 'pt' ? 'Instruções' : 'Instructions'}
            </Label>
            <Textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <SheetFooter className="mt-6">
            <Button type="submit" className="w-full">
              {language === 'pt' ? 'Salvar' : 'Save'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default NewMedicationForm;
