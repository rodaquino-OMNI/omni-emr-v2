
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';

const VitalsSummary: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <h3 className="text-sm font-medium mb-3">{t('vitalSignsSummary')}</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <span className="text-sm">{t('heartRate')}</span>
          <span className="text-sm font-medium">78 bpm</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <span className="text-sm">{t('bloodPressure')}</span>
          <span className="text-sm font-medium">120/80 mmHg</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <span className="text-sm">{t('temperature')}</span>
          <span className="text-sm font-medium">37.0 °C</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <span className="text-sm">{t('oxygenSaturation')}</span>
          <span className="text-sm font-medium">98%</span>
        </div>
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <span className="text-sm">{t('respiratoryRate')}</span>
          <span className="text-sm font-medium">16 {t('breathsPerMinute')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">{t('painLevel')}</span>
          <span className="text-sm font-medium">2/10</span>
        </div>
      </div>
    </>
  );
};

export default VitalsSummary;
