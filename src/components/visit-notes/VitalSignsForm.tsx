
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';

interface VitalSignsFormProps {
  visitNoteId: string;
  patientName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const VitalSignsForm: React.FC<VitalSignsFormProps> = ({
  visitNoteId,
  patientName,
  onClose,
  onSuccess
}) => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    heartRate: '',
    systolic: '',
    diastolic: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: '',
    painLevel: 0,
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePainLevelChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, painLevel: value[0] }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real application, this would call an API
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        language === 'pt'
          ? 'Sinais vitais registrados com sucesso'
          : 'Vital signs recorded successfully'
      );
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error recording vital signs:', error);
      toast.error(
        language === 'pt'
          ? 'Erro ao registrar sinais vitais'
          : 'Error recording vital signs'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {language === 'pt' ? 'Registrar Sinais Vitais' : 'Record Vital Signs'}
        </DialogTitle>
        <div className="text-sm text-muted-foreground mt-1">
          {language === 'pt' ? 'Paciente:' : 'Patient:'} {patientName}
        </div>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heartRate">
              {language === 'pt' ? 'Frequência Cardíaca (bpm)' : 'Heart Rate (bpm)'}
            </Label>
            <Input
              id="heartRate"
              name="heartRate"
              type="number"
              value={formData.heartRate}
              onChange={handleInputChange}
              placeholder="60-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label>
              {language === 'pt' ? 'Pressão Arterial (mmHg)' : 'Blood Pressure (mmHg)'}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="systolic"
                type="number"
                value={formData.systolic}
                onChange={handleInputChange}
                placeholder={language === 'pt' ? 'Sistólica' : 'Systolic'}
              />
              <Input
                name="diastolic"
                type="number"
                value={formData.diastolic}
                onChange={handleInputChange}
                placeholder={language === 'pt' ? 'Diastólica' : 'Diastolic'}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temperature">
              {language === 'pt' ? 'Temperatura (°C)' : 'Temperature (°C)'}
            </Label>
            <Input
              id="temperature"
              name="temperature"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={handleInputChange}
              placeholder="36.5-37.5"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="oxygenSaturation">
              {language === 'pt' ? 'Saturação de O₂ (%)' : 'Oxygen Saturation (%)'}
            </Label>
            <Input
              id="oxygenSaturation"
              name="oxygenSaturation"
              type="number"
              min="0"
              max="100"
              value={formData.oxygenSaturation}
              onChange={handleInputChange}
              placeholder="95-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="respiratoryRate">
              {language === 'pt' ? 'Frequência Respiratória' : 'Respiratory Rate'}
            </Label>
            <Input
              id="respiratoryRate"
              name="respiratoryRate"
              type="number"
              value={formData.respiratoryRate}
              onChange={handleInputChange}
              placeholder="12-20"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>
            {language === 'pt' ? 'Nível de Dor (0-10)' : 'Pain Level (0-10)'}: {formData.painLevel}
          </Label>
          <Slider
            value={[formData.painLevel]}
            min={0}
            max={10}
            step={1}
            onValueChange={handlePainLevelChange}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0: {language === 'pt' ? 'Sem dor' : 'No pain'}</span>
            <span>10: {language === 'pt' ? 'Dor extrema' : 'Worst pain'}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">
            {language === 'pt' ? 'Observações' : 'Notes'}
          </Label>
          <Textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder={
              language === 'pt'
                ? 'Observações adicionais sobre os sinais vitais'
                : 'Additional notes about vital signs'
            }
            rows={3}
          />
        </div>
      </div>
      
      <DialogFooter>
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
          {isSubmitting
            ? (language === 'pt' ? 'Salvando...' : 'Saving...')
            : (language === 'pt' ? 'Salvar' : 'Save')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default VitalSignsForm;
