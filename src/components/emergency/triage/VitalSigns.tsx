
import React from 'react';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export interface VitalSignsData {
  heartRate: number;
  respiratoryRate: number;
  bloodPressure: string;
  temperature: number;
  painLevel: number;
  oxygenSaturation: number;
}

interface VitalSignsProps {
  vitals: VitalSignsData;
  canPerformTriage: boolean;
  onUpdateVitals: () => void;
}

const VitalSigns: React.FC<VitalSignsProps> = ({
  vitals,
  canPerformTriage,
  onUpdateVitals
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{t('vitalSigns')}</h3>
        {canPerformTriage && (
          <Button size="sm" variant="outline" onClick={onUpdateVitals}>
            <Activity className="h-4 w-4 mr-1" />
            {t('updateVitals')}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t('heartRate')}</p>
          <p className="text-lg font-medium">{vitals.heartRate} bpm</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t('bloodPressure')}</p>
          <p className="text-lg font-medium">{vitals.bloodPressure} mmHg</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t('respiratoryRate')}</p>
          <p className="text-lg font-medium">{vitals.respiratoryRate} bpm</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t('temperature')}</p>
          <p className="text-lg font-medium">{vitals.temperature}°C</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t('oxygenSaturation')}</p>
          <p className="text-lg font-medium">{vitals.oxygenSaturation}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t('painLevel')}</p>
          <p className="text-lg font-medium">{vitals.painLevel}/10</p>
        </div>
      </div>
    </div>
  );
};

export default VitalSigns;
