
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export type VitalType = 'heartRate' | 'bloodPressure' | 'temperature' | 'oxygenSaturation';

type VitalsChartProps = {
  data?: any[];
  type?: VitalType;
  patientId?: string;
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

// Generate mock vitals data for a patient
const generateMockVitalsData = (patientId: string, type: VitalType) => {
  const config = vitalConfig[type];
  const [min, max] = config.domain;
  const range = max - min;
  
  const now = new Date();
  const data = [];
  
  // Generate 12 data points, one for each hour
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(time.getHours() - i);
    
    // Generate a value that's somewhat realistic and doesn't change too dramatically
    // We use the patientId as a seed to get consistent results for the same patient
    const seed = parseInt(patientId.slice(-2), 16) / 255; // Get last 2 chars as hex and normalize to 0-1
    const randomFactor = 0.2; // How much random fluctuation
    
    // Base value is determined by patient id for consistency
    const baseValue = min + range * (0.4 + seed * 0.3); // Something in the middle range
    
    // Add some random fluctuation and a slight trend over time
    const trendFactor = (i / 11) * range * 0.1; // Small trend over time
    const randomVariation = (Math.random() - 0.5) * range * randomFactor;
    const value = baseValue + trendFactor + randomVariation;
    
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: Math.round(value * 10) / 10 // Round to 1 decimal place
    });
  }
  
  return data;
};

const VitalsChart = ({ data, type = 'heartRate', patientId, className }: VitalsChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const config = vitalConfig[type];
  
  useEffect(() => {
    // If data is provided, use it, otherwise generate mock data
    if (data && data.length > 0) {
      setChartData(data);
    } else if (patientId) {
      setChartData(generateMockVitalsData(patientId, type));
    }
  }, [patientId, type, data]);
  
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
          data={chartData}
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
