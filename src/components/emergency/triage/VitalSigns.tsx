
import React, { useState } from 'react';
import { Activity, Plus, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import QuickEntryForm from '@/components/vital-signs/QuickEntryForm';
import VitalsChart from '@/components/ui/VitalsChart';
import { Badge } from '@/components/ui/badge';

export interface VitalSignsData {
  heartRate: number;
  respiratoryRate: number;
  bloodPressure: string;
  temperature: number;
  painLevel: number;
  oxygenSaturation: number;
}

const normalRanges = {
  heartRate: [60, 100],
  respiratoryRate: [12, 20],
  systolicBP: [90, 140],
  diastolicBP: [60, 90],
  temperature: [36.1, 37.2],
  oxygenSaturation: [95, 100],
  painLevel: [0, 3]
};

interface VitalSignsProps {
  vitals: VitalSignsData;
  canPerformTriage: boolean;
  onUpdateVitals: () => void;
  patientId: string;
}

const VitalSigns: React.FC<VitalSignsProps> = ({
  vitals,
  canPerformTriage,
  onUpdateVitals,
  patientId
}) => {
  const { t } = useTranslation();
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [showTrends, setShowTrends] = useState(false);

  // Parse blood pressure to check if it's abnormal
  const bloodPressureParts = vitals.bloodPressure.split('/');
  const systolic = bloodPressureParts[0] ? parseInt(bloodPressureParts[0], 10) : 0;
  const diastolic = bloodPressureParts[1] ? parseInt(bloodPressureParts[1], 10) : 0;
  
  // Check for abnormal vitals
  const isHeartRateAbnormal = vitals.heartRate < normalRanges.heartRate[0] || vitals.heartRate > normalRanges.heartRate[1];
  const isRespiratoryRateAbnormal = vitals.respiratoryRate < normalRanges.respiratoryRate[0] || vitals.respiratoryRate > normalRanges.respiratoryRate[1];
  const isSystolicAbnormal = systolic < normalRanges.systolicBP[0] || systolic > normalRanges.systolicBP[1];
  const isDiastolicAbnormal = diastolic < normalRanges.diastolicBP[0] || diastolic > normalRanges.diastolicBP[1];
  const isTemperatureAbnormal = vitals.temperature < normalRanges.temperature[0] || vitals.temperature > normalRanges.temperature[1];
  const isOxygenSaturationAbnormal = vitals.oxygenSaturation < normalRanges.oxygenSaturation[0] || vitals.oxygenSaturation > normalRanges.oxygenSaturation[1];
  const isPainLevelHigh = vitals.painLevel > normalRanges.painLevel[1];
  
  // Count abnormal values
  const abnormalCount = [
    isHeartRateAbnormal,
    isRespiratoryRateAbnormal,
    isSystolicAbnormal || isDiastolicAbnormal,
    isTemperatureAbnormal,
    isOxygenSaturationAbnormal,
    isPainLevelHigh
  ].filter(Boolean).length;
  
  const handleQuickEntrySuccess = () => {
    setQuickEntryOpen(false);
    onUpdateVitals();
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">{t('vitalSigns')}</h3>
          {abnormalCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {abnormalCount} {t('abnormal')}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowTrends(!showTrends)}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {showTrends ? t('hideTrends') : t('showTrends')}
          </Button>
          
          {canPerformTriage && (
            <Button size="sm" variant="outline" onClick={() => setQuickEntryOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              {t('quickEntry')}
            </Button>
          )}
          
          {canPerformTriage && (
            <Button size="sm" variant="outline" onClick={onUpdateVitals}>
              <Activity className="h-4 w-4 mr-1" />
              {t('updateVitals')}
            </Button>
          )}
        </div>
      </div>
      
      {showTrends && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 border rounded-md p-2">
            <VitalsChart patientId={patientId} type="heartRate" timeRange="24h" />
          </div>
          <div className="h-48 border rounded-md p-2">
            <VitalsChart patientId={patientId} type="bloodPressure" timeRange="24h" />
          </div>
          <div className="h-48 border rounded-md p-2">
            <VitalsChart patientId={patientId} type="temperature" timeRange="24h" />
          </div>
          <div className="h-48 border rounded-md p-2">
            <VitalsChart patientId={patientId} type="oxygenSaturation" timeRange="24h" />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t('heartRate')}</p>
          <div className="flex items-center">
            <p className={`text-lg font-medium ${isHeartRateAbnormal ? 'text-destructive' : ''}`}>
              {vitals.heartRate} bpm
            </p>
            {isHeartRateAbnormal && <AlertTriangle className="h-4 w-4 text-destructive ml-1" />}
          </div>
          <p className="text-xs text-muted-foreground">
            {t('normalRange')}: {normalRanges.heartRate[0]}-{normalRanges.heartRate[1]} bpm
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{t('bloodPressure')}</p>
          <div className="flex items-center">
            <p className={`text-lg font-medium ${isSystolicAbnormal || isDiastolicAbnormal ? 'text-destructive' : ''}`}>
              {vitals.bloodPressure} mmHg
            </p>
            {(isSystolicAbnormal || isDiastolicAbnormal) && 
              <AlertTriangle className="h-4 w-4 text-destructive ml-1" />
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {t('normalRange')}: {normalRanges.systolicBP[0]}-{normalRanges.systolicBP[1]}/{normalRanges.diastolicBP[0]}-{normalRanges.diastolicBP[1]} mmHg
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{t('respiratoryRate')}</p>
          <div className="flex items-center">
            <p className={`text-lg font-medium ${isRespiratoryRateAbnormal ? 'text-destructive' : ''}`}>
              {vitals.respiratoryRate} bpm
            </p>
            {isRespiratoryRateAbnormal && 
              <AlertTriangle className="h-4 w-4 text-destructive ml-1" />
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {t('normalRange')}: {normalRanges.respiratoryRate[0]}-{normalRanges.respiratoryRate[1]} bpm
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{t('temperature')}</p>
          <div className="flex items-center">
            <p className={`text-lg font-medium ${isTemperatureAbnormal ? 'text-destructive' : ''}`}>
              {vitals.temperature}°C
            </p>
            {isTemperatureAbnormal && 
              <AlertTriangle className="h-4 w-4 text-destructive ml-1" />
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {t('normalRange')}: {normalRanges.temperature[0]}-{normalRanges.temperature[1]}°C
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{t('oxygenSaturation')}</p>
          <div className="flex items-center">
            <p className={`text-lg font-medium ${isOxygenSaturationAbnormal ? 'text-destructive' : ''}`}>
              {vitals.oxygenSaturation}%
            </p>
            {isOxygenSaturationAbnormal && 
              <AlertTriangle className="h-4 w-4 text-destructive ml-1" />
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {t('normalRange')}: {normalRanges.oxygenSaturation[0]}-{normalRanges.oxygenSaturation[1]}%
          </p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">{t('painLevel')}</p>
          <div className="flex items-center">
            <p className={`text-lg font-medium ${isPainLevelHigh ? 'text-destructive' : ''}`}>
              {vitals.painLevel}/10
            </p>
            {isPainLevelHigh && 
              <AlertTriangle className="h-4 w-4 text-destructive ml-1" />
            }
          </div>
          <p className="text-xs text-muted-foreground">
            {t('normalRange')}: {normalRanges.painLevel[0]}-{normalRanges.painLevel[1]}/10
          </p>
        </div>
      </div>
      
      <Dialog open={quickEntryOpen} onOpenChange={setQuickEntryOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('quickVitalSigns')}</DialogTitle>
          </DialogHeader>
          <QuickEntryForm 
            patientId={patientId}
            onSuccess={handleQuickEntrySuccess}
            onCancel={() => setQuickEntryOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VitalSigns;
