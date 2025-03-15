
import React from 'react';
import { Line } from 'recharts';
import { VitalType, VitalDataPoint } from '../types/vitalsTypes';
import { VitalChartConfig } from '../types/vitalsTypes';
import { useTranslation } from '@/hooks/useTranslation';

interface VitalsChartLinesProps {
  type: VitalType;
  data: VitalDataPoint[];
  config: VitalChartConfig;
}

const VitalsChartLines: React.FC<VitalsChartLinesProps> = ({ type, data, config }) => {
  const { t } = useTranslation();
  
  // Custom dot renderer to show abnormal values in red
  const renderDot = (props: any, dataIndex: number, isAbnormal: boolean) => {
    const { cx, cy } = props;
    
    if (!cx || !cy) return null;
    
    return (
      <g key={`dot-${dataIndex}`}>
        <circle 
          cx={cx} 
          cy={cy} 
          r={isAbnormal ? 5 : 4} 
          fill={isAbnormal ? '#ef4444' : (props.stroke || config.color)}
          stroke={isAbnormal ? '#fff' : 'none'}
          strokeWidth={isAbnormal ? 1.5 : 0}
        />
      </g>
    );
  };

  if (type === 'bloodPressure') {
    return (
      <>
        <Line 
          type="monotone" 
          dataKey="value.systolic" 
          stroke={config.color} 
          strokeWidth={2.5}
          activeDot={{ r: 6 }}
          dot={(props: any) => {
            const index = props.index;
            if (index === undefined || !data[index]) return null;
            const entry = data[index];
            return renderDot(props, index, entry.value.isAbnormal);
          }}
          name={`${config.label} (${t('systolic')})`}
          connectNulls={true}
        />
        <Line 
          type="monotone" 
          dataKey="value.diastolic" 
          stroke={config.colorSecondary || '#6366f1'} 
          strokeWidth={2.5}
          strokeDasharray="4 2"
          activeDot={{ r: 6 }}
          dot={(props: any) => {
            const index = props.index;
            if (index === undefined || !data[index]) return null;
            const entry = data[index];
            return renderDot(props, index, entry.value.isAbnormal);
          }}
          name={`${config.label} (${t('diastolic')})`}
          connectNulls={true}
        />
      </>
    );
  }
  
  return (
    <Line 
      type="monotone" 
      dataKey="value" 
      stroke={config.color} 
      strokeWidth={2.5}
      activeDot={{ r: 6 }}
      dot={(props: any) => {
        const index = props.index;
        if (index === undefined || !data[index]) return null;
        const entry = data[index];
        return renderDot(props, index, entry.isAbnormal);
      }}
      name={config.label}
      connectNulls={true}
    />
  );
};

export default VitalsChartLines;
