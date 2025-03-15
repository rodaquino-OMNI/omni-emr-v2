
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Droplets, Calculator, Check } from 'lucide-react';

interface MedicationData {
  id: string;
  medicationName: string;
  dosage: string;
  route: string;
}

interface IVCalculatorProps {
  open: boolean;
  onClose: () => void;
  medication: MedicationData | null;
  initialRate?: number;
  initialDuration?: number;
  onSave: (rate: number, duration: number) => void;
}

const IVCalculator = ({
  open,
  onClose,
  medication,
  initialRate = 100,
  initialDuration = 30,
  onSave
}: IVCalculatorProps) => {
  const { t } = useTranslation();
  const [volume, setVolume] = useState<number>(100);
  const [concentration, setConcentration] = useState<number>(1);
  const [rate, setRate] = useState<number>(initialRate || 100);
  const [duration, setDuration] = useState<number>(initialDuration || 30);
  const [weight, setWeight] = useState<number>(70);
  const [dosePerKg, setDosePerKg] = useState<number>(0);
  const [useWeightBased, setUseWeightBased] = useState<boolean>(false);
  
  // Update rate when volume or duration changes
  useEffect(() => {
    if (duration > 0) {
      const calculatedRate = (volume / duration) * 60;
      setRate(Math.round(calculatedRate));
    }
  }, [volume, duration]);
  
  // Update duration when volume or rate changes
  useEffect(() => {
    if (rate > 0) {
      const calculatedDuration = (volume / rate) * 60;
      setDuration(Math.round(calculatedDuration));
    }
  }, [volume, rate]);
  
  // Calculate dose per kg when weight changes
  useEffect(() => {
    if (weight > 0 && concentration > 0) {
      const calculatedDosePerKg = (rate * concentration) / weight;
      setDosePerKg(calculatedDosePerKg);
    }
  }, [rate, concentration, weight]);
  
  const handleSave = () => {
    onSave(rate, duration);
  };
  
  const handleRateChange = (value: number) => {
    setRate(value);
    // Don't update duration here, it will be updated by the effect
  };
  
  const handleDurationChange = (value: number) => {
    setDuration(value);
    // Don't update rate here, it will be updated by the effect
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Droplets className="mr-2 h-5 w-5" />
            {t('ivCalculator')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {medication && (
            <div className="text-center font-medium">
              {medication.medicationName} {medication.dosage}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="volume">{t('totalVolume')} (mL)</Label>
              <Input
                id="volume"
                type="number"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="concentration">{t('concentration')} (mg/mL)</Label>
              <Input
                id="concentration"
                type="number"
                value={concentration}
                onChange={(e) => setConcentration(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="rate">{t('flowRate')} (mL/hr)</Label>
                <div className="text-sm font-medium">{rate} mL/hr</div>
              </div>
              <Slider
                id="rate"
                min={1}
                max={999}
                step={1}
                value={[rate]}
                onValueChange={(values) => handleRateChange(values[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="duration">{t('infusionDuration')} (min)</Label>
                <div className="text-sm font-medium">{duration} min</div>
              </div>
              <Slider
                id="duration"
                min={1}
                max={240}
                step={1}
                value={[duration]}
                onValueChange={(values) => handleDurationChange(values[0])}
              />
            </div>
            
            <div className="pt-2 space-y-2">
              <div className="text-sm font-medium">{t('weightBasedCalculation')}</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">{t('patientWeight')} (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <div className="p-2 bg-blue-50 border border-blue-200 rounded-md w-full text-center">
                    <div className="text-xs text-blue-700 font-medium">{t('dosePerKg')}</div>
                    <div className="text-sm font-medium">{dosePerKg.toFixed(2)} mg/kg/hr</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Calculator result */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center text-green-800 font-medium">
                <Calculator className="h-4 w-4 mr-1 text-green-600" />
                {t('calculationSummary')}
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-sm">
                <div className="text-green-700">{t('totalVolume')}:</div>
                <div className="font-medium">{volume} mL</div>
                <div className="text-green-700">{t('flowRate')}:</div>
                <div className="font-medium">{rate} mL/hr</div>
                <div className="text-green-700">{t('infusionDuration')}:</div>
                <div className="font-medium">{duration} min</div>
                <div className="text-green-700">{t('totalDose')}:</div>
                <div className="font-medium">{volume * concentration} mg</div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            {t('saveSettings')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IVCalculator;
