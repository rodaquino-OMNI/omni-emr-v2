
import React from 'react';
import { ReferenceLine } from 'recharts';
import { VitalType, VitalChartConfig } from '../types/vitalsTypes';

interface VitalsReferenceLinesProps {
  type: VitalType;
  config: VitalChartConfig;
}

const VitalsReferenceLines: React.FC<VitalsReferenceLinesProps> = ({ type, config }) => {
  if (type === 'bloodPressure') {
    // Blood pressure has special reference lines handled differently
    return null;
  }

  return (
    <>
      {config.normalRange && (
        <>
          <ReferenceLine 
            y={config.normalRange[0]} 
            stroke="#94a3b8" 
            strokeDasharray="3 3" 
            strokeWidth={1}
          />
          <ReferenceLine 
            y={config.normalRange[1]} 
            stroke="#94a3b8" 
            strokeDasharray="3 3" 
            strokeWidth={1}
          />
        </>
      )}
      
      {config.criticalLow && (
        <ReferenceLine 
          y={config.criticalLow} 
          stroke="#f43f5e" 
          strokeDasharray="3 3" 
          strokeWidth={1}
        />
      )}
      
      {config.criticalHigh && (
        <ReferenceLine 
          y={config.criticalHigh} 
          stroke="#f43f5e" 
          strokeDasharray="3 3" 
          strokeWidth={1}
        />
      )}
    </>
  );
};

export default VitalsReferenceLines;
