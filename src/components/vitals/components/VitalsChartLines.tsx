
import React from 'react';
import { Line } from 'recharts';
import { VitalType, VitalDataPoint } from '../types/vitalsTypes';
import { VitalChartConfig } from '../types/vitalsTypes';

interface VitalsChartLinesProps {
  type: VitalType;
  data: VitalDataPoint[];
  config: VitalChartConfig;
}

const VitalsChartLines: React.FC<VitalsChartLinesProps> = ({ type, data, config }) => {
  // Custom dot renderer to show abnormal values in red
  const renderDot = (props: any, dataIndex: number, isAbnormal: boolean) => {
    const { cx, cy } = props;
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
            const entry = data[index];
            return renderDot(props, index, entry.value.isAbnormal);
          }}
          name={`${config.label} (Systolic)`}
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
            const entry = data[index];
            return renderDot(props, index, entry.value.isAbnormal);
          }}
          name={`${config.label} (Diastolic)`}
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
        const entry = data[index];
        return renderDot(props, index, entry.isAbnormal);
      }}
      name={config.label}
    />
  );
};

export default VitalsChartLines;
