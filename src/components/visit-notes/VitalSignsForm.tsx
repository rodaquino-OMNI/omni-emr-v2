
import React, { useState } from 'react';
import { VitalSigns } from '@/pages/VisitNotes';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, X } from 'lucide-react';

interface VitalSignsFormProps {
  initialVitals: VitalSigns;
  onSubmit: (vitals: VitalSigns) => void;
  onCancel: () => void;
}

const VitalSignsForm: React.FC<VitalSignsFormProps> = ({
  initialVitals,
  onSubmit,
  onCancel
}) => {
  const { language } = useTranslation();
  const [vitals, setVitals] = useState<VitalSigns>(initialVitals);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({
      ...prev,
      [name]: name === 'notes' ? value : (value === '' ? undefined : Number(value))
    }));
  };
  
  const handleBloodPressureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitals(prev => ({
      ...prev,
      bloodPressure: e.target.value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...vitals,
      recordedAt: new Date().toISOString()
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-medium">
        {language === 'pt' ? 'Registro de Sinais Vitais' : 'Record Vital Signs'}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="heartRate">
            {language === 'pt' ? 'Frequência Cardíaca (bpm)' : 'Heart Rate (bpm)'}
          </Label>
          <Input
            id="heartRate"
            name="heartRate"
            type="number"
            value={vitals.heartRate || ''}
            onChange={handleChange}
            placeholder="70"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="bloodPressure">
            {language === 'pt' ? 'Pressão Arterial (mmHg)' : 'Blood Pressure (mmHg)'}
          </Label>
          <Input
            id="bloodPressure"
            name="bloodPressure"
            value={vitals.bloodPressure || ''}
            onChange={handleBloodPressureChange}
            placeholder="120/80"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="temperature">
            {language === 'pt' ? 'Temperatura (°C)' : 'Temperature (°C)'}
          </Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            value={vitals.temperature || ''}
            onChange={handleChange}
            placeholder="37.0"
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
            value={vitals.respiratoryRate || ''}
            onChange={handleChange}
            placeholder="16"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="oxygenSaturation">
            {language === 'pt' ? 'Saturação de O2 (%)' : 'O2 Saturation (%)'}
          </Label>
          <Input
            id="oxygenSaturation"
            name="oxygenSaturation"
            type="number"
            min="0"
            max="100"
            value={vitals.oxygenSaturation || ''}
            onChange={handleChange}
            placeholder="98"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="painLevel">
            {language === 'pt' ? 'Nível de Dor (0-10)' : 'Pain Level (0-10)'}
          </Label>
          <Input
            id="painLevel"
            name="painLevel"
            type="number"
            min="0"
            max="10"
            value={vitals.painLevel || ''}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">
          {language === 'pt' ? 'Observações' : 'Notes'}
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={vitals.notes || ''}
          onChange={handleChange}
          placeholder={language === 'pt' ? 'Observações adicionais...' : 'Additional notes...'}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          {language === 'pt' ? 'Cancelar' : 'Cancel'}
        </Button>
        <Button type="submit">
          <Check className="h-4 w-4 mr-1" />
          {language === 'pt' ? 'Salvar' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default VitalSignsForm;
