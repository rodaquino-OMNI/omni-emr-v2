
import React, { useState } from 'react';
import VitalsChart from '@/components/ui/VitalsChart';
import { useTranslation } from '@/hooks/useTranslation';
import { TimeRangeType } from '@/components/vitals/types/vitalsTypes';

interface CurrentVitalsTabProps {
  patientId: string;
}

const CurrentVitalsTab: React.FC<CurrentVitalsTabProps> = ({ patientId }) => {
  const { t } = useTranslation();
  const [timeRange] = useState<TimeRangeType>('24h');
  
  return (
    <div>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white shadow-sm border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-muted-foreground">{t('bloodPressure')}</div>
          <div className="text-2xl font-semibold mt-1">120/80 <span className="text-sm font-normal">mmHg</span></div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-0.5"></span>
            {t('normal')}
          </div>
        </div>
        
        <div className="bg-white shadow-sm border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-muted-foreground">{t('heartRate')}</div>
          <div className="text-2xl font-semibold mt-1">78 <span className="text-sm font-normal">bpm</span></div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-0.5"></span>
            {t('normal')}
          </div>
        </div>
        
        <div className="bg-white shadow-sm border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-muted-foreground">{t('temperature')}</div>
          <div className="text-2xl font-semibold mt-1">36.7 <span className="text-sm font-normal">°C</span></div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-0.5"></span>
            {t('normal')}
          </div>
        </div>
        
        <div className="bg-white shadow-sm border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="text-sm text-muted-foreground">{t('oxygenSaturation')}</div>
          <div className="text-2xl font-semibold mt-1">98<span className="text-sm font-normal">%</span></div>
          <div className="text-sm text-green-600 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mt-0.5"></span>
            {t('normal')}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="heartRate" timeRange={timeRange} />
        </div>
        
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="bloodPressure" timeRange={timeRange} />
        </div>
        
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="temperature" timeRange={timeRange} />
        </div>
        
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="oxygenSaturation" timeRange={timeRange} />
        </div>
        
        <div className="glass-card p-5">
          <VitalsChart patientId={patientId} type="respiratoryRate" timeRange={timeRange} />
        </div>
      </div>
    </div>
  );
};

export default CurrentVitalsTab;
