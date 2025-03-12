
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export type VitalType = 'heartRate' | 'bloodPressure' | 'temperature' | 'oxygenSaturation';

type VitalsChartProps = {
  data: any[];
  type: VitalType;
  className?: string;
};

const vitalConfig = {
  heartRate: {
    name: 'Heart Rate',
    unit: 'bpm',
    dataKey: 'value',
    color: 'rgba(220, 48, 48, 1)',
    gradient: ['rgba(220, 48, 48, 0.2)', 'rgba(220, 48, 48, 0)'],
    domain: [40, 160]
  },
  bloodPressure: {
    name: 'Blood Pressure',
    unit: 'mmHg',
    dataKey: 'value',
    color: 'rgba(30, 64, 175, 1)',
    gradient: ['rgba(30, 64, 175, 0.2)', 'rgba(30, 64, 175, 0)'],
    domain: [60, 200]
  },
  temperature: {
    name: 'Temperature',
    unit: '°F',
    dataKey: 'value',
    color: 'rgba(236, 72, 153, 1)',
    gradient: ['rgba(236, 72, 153, 0.2)', 'rgba(236, 72, 153, 0)'],
    domain: [95, 105]
  },
  oxygenSaturation: {
    name: 'Oxygen Saturation',
    unit: '%',
    dataKey: 'value',
    color: 'rgba(16, 185, 129, 1)',
    gradient: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0)'],
    domain: [80, 100]
  }
};

const VitalsChart = ({ data, type, className }: VitalsChartProps) => {
  const config = vitalConfig[type];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-border rounded shadow-sm">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium">{`${payload[0].value} ${config.unit}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("w-full h-[120px]", className)}>
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="text-sm font-medium">{config.name}</h4>
        <span className="text-xs text-muted-foreground">{config.unit}</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.gradient[0]} />
              <stop offset="100%" stopColor={config.gradient[1]} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'rgba(0, 0, 0, 0.4)' }}
          />
          <YAxis 
            domain={config.domain}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'rgba(0, 0, 0, 0.4)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey={config.dataKey} 
            stroke={config.color} 
            strokeWidth={2}
            fill={`url(#gradient-${type})`}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;
