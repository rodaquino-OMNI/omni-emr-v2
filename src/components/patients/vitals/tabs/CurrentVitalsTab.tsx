
import React from 'react';
import VitalsChart from '@/components/ui/VitalsChart';
import { useTranslation } from '@/hooks/useTranslation';

interface CurrentVitalsTabProps {
  patientId: string;
}

const CurrentVitalsTab: React.FC<CurrentVitalsTabProps> = ({ patientId }) => {
  const { t } = useTranslation();
  
  return (
    <div>
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-md">
          <div className="text-sm text-muted-foreground">{t('bloodPressure')}</div>
          <div className="text-2xl font-semibold mt-1">120/80 <span className="text-sm font-normal">mmHg</span></div>
          <div className="text-sm text-green-600">{t('normal')}</div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md">
          <div className="text-sm text-muted-foreground">{t('heartRate')}</div>
          <div className="text-2xl font-semibold mt-1">78 <span className="text-sm font-normal">bpm</span></div>
          <div className="text-sm text-green-600">{t('normal')}</div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md">
          <div className="text-sm text-muted-foreground">{t('temperature')}</div>
          <div className="text-2xl font-semibold mt-1">36.7 <span className="text-sm font-normal">°C</span></div>
          <div className="text-sm text-green-600">{t('normal')}</div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md">
          <div className="text-sm text-muted-foreground">{t('oxygenSaturation')}</div>
          <div className="text-2xl font-semibold mt-1">98<span className="text-sm font-normal">%</span></div>
          <div className="text-sm text-green-600">{t('normal')}</div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="heartRate" timeRange="24h" />
        </div>
        
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="bloodPressure" timeRange="24h" />
        </div>
        
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="temperature" timeRange="24h" />
        </div>
        
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="oxygenSaturation" timeRange="24h" />
        </div>
        
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="respiratoryRate" timeRange="24h" />
        </div>
      </div>
    </div>
  );
};

export default CurrentVitalsTab;
