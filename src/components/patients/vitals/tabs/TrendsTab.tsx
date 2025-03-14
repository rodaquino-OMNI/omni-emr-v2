
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import VitalsChart from '@/components/ui/VitalsChart';
import { useTranslation } from '@/hooks/useTranslation';
import { TimeRangeType } from '@/components/vitals/types/vitalsTypes';

interface TrendsTabProps {
  patientId: string;
}

const TrendsTab: React.FC<TrendsTabProps> = ({ patientId }) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<TimeRangeType>('24h');

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-2">
        <span className="text-sm text-muted-foreground mr-2">{t('timeRange')}:</span>
        <Button 
          variant={timeRange === '24h' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setTimeRange('24h')}
        >
          24h
        </Button>
        <Button 
          variant={timeRange === '3d' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setTimeRange('3d')}
        >
          3d
        </Button>
        <Button 
          variant={timeRange === '7d' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => setTimeRange('7d')}
        >
          7d
        </Button>
      </div>
      
      <div className="glass-card p-4">
        <VitalsChart patientId={patientId} type="heartRate" timeRange={timeRange} />
      </div>
      <div className="glass-card p-4 mt-4">
        <VitalsChart patientId={patientId} type="bloodPressure" timeRange={timeRange} />
      </div>
      <div className="glass-card p-4 mt-4">
        <VitalsChart patientId={patientId} type="temperature" timeRange={timeRange} />
      </div>
      <div className="glass-card p-4 mt-4">
        <VitalsChart patientId={patientId} type="oxygenSaturation" timeRange={timeRange} />
      </div>
    </>
  );
};

export default TrendsTab;
