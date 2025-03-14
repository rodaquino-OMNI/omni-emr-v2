
import React, { useState } from 'react';
import VitalsChart from '@/components/ui/VitalsChart';
import { useTranslation } from '@/hooks/useTranslation';
import { TimeRangeType } from '@/components/vitals/types/vitalsTypes';
import VitalsTimeRangeSelector from '@/components/vitals/components/VitalsTimeRangeSelector';

interface TrendsTabProps {
  patientId: string;
}

const TrendsTab: React.FC<TrendsTabProps> = ({ patientId }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRangeType>('24h');

  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <span className="text-sm text-muted-foreground mr-2">{t('timeRange')}:</span>
        <VitalsTimeRangeSelector 
          selectedTimeRange={timeRange} 
          onChange={setTimeRange} 
        />
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
    </>
  );
};

export default TrendsTab;
