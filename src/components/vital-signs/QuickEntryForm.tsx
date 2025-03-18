
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2, Activity, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface QuickEntryFormProps {
  patientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuickEntryForm: React.FC<QuickEntryFormProps> = ({ 
  patientId, 
  onSuccess, 
  onCancel 
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [vitals, setVitals] = useState({
    temperature: '',
    heartRate: '',
    respiratoryRate: '',
    systolicBP: '',
    diastolicBP: '',
    oxygenSaturation: '',
    painLevel: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVitals({
      ...vitals,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error(t('authRequired'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Extract numeric values
      const temperature = vitals.temperature ? parseFloat(vitals.temperature) : null;
      const heartRate = vitals.heartRate ? parseInt(vitals.heartRate, 10) : null;
      const respiratoryRate = vitals.respiratoryRate ? parseInt(vitals.respiratoryRate, 10) : null;
      const systolicBP = vitals.systolicBP ? parseInt(vitals.systolicBP, 10) : null;
      const diastolicBP = vitals.diastolicBP ? parseInt(vitals.diastolicBP, 10) : null;
      const oxygenSaturation = vitals.oxygenSaturation ? parseInt(vitals.oxygenSaturation, 10) : null;
      const painLevel = vitals.painLevel ? parseInt(vitals.painLevel, 10) : null;
      
      // Insert into Supabase
      const { error } = await supabase
        .from('vital_signs')
        .insert({
          patient_id: patientId,
          temperature,
          heart_rate: heartRate,
          respiratory_rate: respiratoryRate,
          systolic_bp: systolicBP,
          diastolic_bp: diastolicBP,
          oxygen_saturation: oxygenSaturation,
          pain_level: painLevel,
          recorded_by: user.id,
          timestamp: new Date().toISOString()
        });
        
      if (error) throw error;
      
      toast.success(t('vitalSignsRecorded'), {
        description: t('vitalSignsRecordedSuccessfully')
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error recording vital signs:', error);
      toast.error(t('errorRecordingVitals'), {
        description: t('pleaseTryAgain')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          {t('quickVitalSigns')}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="temperature" className="text-sm font-medium">
                {t('temperature')} (°C)
              </label>
              <Input
                id="temperature"
                name="temperature"
                type="number"
                step="0.1"
                placeholder="36.8"
                value={vitals.temperature}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="heartRate" className="text-sm font-medium">
                {t('heartRate')} (bpm)
              </label>
              <Input
                id="heartRate"
                name="heartRate"
                type="number"
                placeholder="72"
                value={vitals.heartRate}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="respiratoryRate" className="text-sm font-medium">
                {t('respiratoryRate')} (bpm)
              </label>
              <Input
                id="respiratoryRate"
                name="respiratoryRate"
                type="number"
                placeholder="16"
                value={vitals.respiratoryRate}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="oxygenSaturation" className="text-sm font-medium">
                {t('oxygenSaturation')} (%)
              </label>
              <Input
                id="oxygenSaturation"
                name="oxygenSaturation"
                type="number"
                min="0"
                max="100"
                placeholder="98"
                value={vitals.oxygenSaturation}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="systolicBP" className="text-sm font-medium">
                {t('systolicBP')} (mmHg)
              </label>
              <Input
                id="systolicBP"
                name="systolicBP"
                type="number"
                placeholder="120"
                value={vitals.systolicBP}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="diastolicBP" className="text-sm font-medium">
                {t('diastolicBP')} (mmHg)
              </label>
              <Input
                id="diastolicBP"
                name="diastolicBP"
                type="number"
                placeholder="80"
                value={vitals.diastolicBP}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="painLevel" className="text-sm font-medium">
                {t('painLevel')} (0-10)
              </label>
              <Input
                id="painLevel"
                name="painLevel"
                type="number"
                min="0"
                max="10"
                placeholder="0"
                value={vitals.painLevel}
                onChange={handleChange}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('saving')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('saveVitals')}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuickEntryForm;
