
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { visitNoteService, VitalSigns } from '@/services/visitNotes/visitNoteService';

interface VitalSignsFormProps {
  visitNoteId: string;
  patientName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const VitalSignsForm: React.FC<VitalSignsFormProps> = ({ 
  visitNoteId, 
  patientName, 
  onClose, 
  onSuccess 
}) => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<VitalSigns, 'recordedAt' | 'recordedBy' | 'recordedById'>>({
    heartRate: 75,
    bloodPressure: '120/80',
    temperature: 36.5,
    oxygenSaturation: 98,
    respiratoryRate: 16,
    painLevel: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handlePainLevelChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, painLevel: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(
        language === 'pt' ? 'Não autorizado' : 'Not authorized',
        {
          description: language === 'pt' 
            ? 'Você precisa estar logado para registrar sinais vitais' 
            : 'You need to be logged in to record vital signs'
        }
      );
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const vitalSigns: VitalSigns = {
        ...formData,
        recordedBy: user.name || 'Unknown Provider',
        recordedById: user.id
      };
      
      const updatedNote = await visitNoteService.recordVitalSigns(visitNoteId, vitalSigns);
      
      if (!updatedNote) {
        throw new Error('Failed to update vital signs');
      }
      
      toast.success(
        language === 'pt' ? 'Sinais vitais registrados' : 'Vital signs recorded',
        {
          description: language === 'pt'
            ? 'Os sinais vitais foram registrados com sucesso'
            : 'Vital signs have been recorded successfully'
        }
      );
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('Error recording vital signs:', error);
      toast.error(
        language === 'pt' ? 'Erro' : 'Error',
        {
          description: language === 'pt'
            ? 'Ocorreu um erro ao registrar os sinais vitais'
            : 'An error occurred while recording vital signs'
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>
          {language === 'pt' ? `Registrar Sinais Vitais: ${patientName}` : `Record Vital Signs: ${patientName}`}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heartRate">
                {language === 'pt' ? 'Frequência Cardíaca (bpm)' : 'Heart Rate (bpm)'}
              </Label>
              <Input
                id="heartRate"
                name="heartRate"
                type="number"
                value={formData.heartRate}
                onChange={handleNumberInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodPressure">
                {language === 'pt' ? 'Pressão Arterial (mmHg)' : 'Blood Pressure (mmHg)'}
              </Label>
              <Input
                id="bloodPressure"
                name="bloodPressure"
                placeholder="120/80"
                value={formData.bloodPressure}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                onChange={handleNumberInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oxygenSaturation">
                {language === 'pt' ? 'Saturação de Oxigênio (%)' : 'Oxygen Saturation (%)'}
              </Label>
              <Input
                id="oxygenSaturation"
                name="oxygenSaturation"
                type="number"
                min="0"
                max="100"
                value={formData.oxygenSaturation}
                onChange={handleNumberInputChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="respiratoryRate">
                {language === 'pt' ? 'Frequência Respiratória (rpm)' : 'Respiratory Rate (bpm)'}
              </Label>
              <Input
                id="respiratoryRate"
                name="respiratoryRate"
                type="number"
                value={formData.respiratoryRate}
                onChange={handleNumberInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="painLevel">
                {language === 'pt' ? `Nível de Dor (${formData.painLevel}/10)` : `Pain Level (${formData.painLevel}/10)`}
              </Label>
              <Slider
                id="painLevel"
                min={0}
                max={10}
                step={1}
                value={[formData.painLevel || 0]}
                onValueChange={handlePainLevelChange}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
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
            {isSubmitting ? (
              language === 'pt' ? 'Salvando...' : 'Saving...'
            ) : (
              language === 'pt' ? 'Salvar' : 'Save'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default VitalSignsForm;
