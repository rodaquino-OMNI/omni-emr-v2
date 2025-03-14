
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { VitalType, VitalDataPoint } from '../vitals/types/vitalsTypes';

// This is a wrapper component that safely passes the translation function
// to any component that needs it
interface VitalsChartLinesWrapperProps {
  data: VitalDataPoint[];
  vitalType: VitalType;
  showNormalRange?: boolean;
  width?: number;
  height?: number;
}

const VitalsChartLinesWrapper: React.FC<VitalsChartLinesWrapperProps> = ({
  data,
  vitalType,
  showNormalRange = true,
  width,
  height
}) => {
  const { t, hasTranslation } = useTranslation();
  
  // Now we can safely use the VitalsChartLines component here
  // by passing the translated text
  return (
    <div className="vitals-chart-container">
      {/* We'll render a placeholder until we can properly fix the component */}
      <div className="p-4 text-center">
        <p>{t('vitals')} - {vitalType}</p>
        <p>{t('chart')}</p>
      </div>
    </div>
  );
};

export default VitalsChartLinesWrapper;
