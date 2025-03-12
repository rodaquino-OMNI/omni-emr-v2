
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type VitalsChartProps = {
  patientId: string;
  type: 'heartRate' | 'bloodPressure' | 'temperature' | 'oxygenSaturation';
};

// Generate mock data for vitals
const generateMockVitalsData = (type: string, patientId: string) => {
  const today = new Date();
  const data = [];
  
  // Generate data for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    let value;
    
    // Generate realistic-looking vital signs based on patient ID and type
    const patientSeed = parseInt(patientId) || 1;
    const daySeed = i + 1;
    const randomFactor = Math.sin(patientSeed * daySeed) * 10;
    
    switch (type) {
      case 'heartRate':
        // Normal heart rate: 60-100 bpm
        value = Math.floor(80 + randomFactor);
        break;
      case 'bloodPressure':
        // Return both systolic and diastolic
        const systolic = Math.floor(120 + randomFactor);
        const diastolic = Math.floor(80 + randomFactor * 0.5);
        value = { systolic, diastolic };
        break;
      case 'temperature':
        // Normal body temperature: ~98.6°F (37°C)
        value = (98.6 + randomFactor * 0.1).toFixed(1);
        break;
      case 'oxygenSaturation':
        // Normal O2 sat: 95-100%
        value = Math.min(100, Math.floor(97 + randomFactor * 0.3));
        break;
      default:
        value = 0;
    }
    
    data.push({
      date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value
    });
  }
  
  return data;
};

const VitalsChart = ({ patientId, type }: VitalsChartProps) => {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate mock data when component mounts
    const mockData = generateMockVitalsData(type, patientId);
    setData(mockData);
  }, [type, patientId]);
  
  // Configuration based on vital type
  const getChartConfig = () => {
    switch (type) {
      case 'heartRate':
        return {
          label: 'Heart Rate',
          unit: 'bpm',
          color: '#f43f5e',
          domain: [40, 160]
        };
      case 'bloodPressure':
        return {
          label: 'Blood Pressure',
          unit: 'mmHg',
          color: '#0ea5e9',
          colorSecondary: '#6366f1',
          domain: [40, 200]
        };
      case 'temperature':
        return {
          label: 'Temperature',
          unit: '°F',
          color: '#f97316',
          domain: [97, 103]
        };
      case 'oxygenSaturation':
        return {
          label: 'Oxygen Saturation',
          unit: '%',
          color: '#10b981',
          domain: [85, 100]
        };
      default:
        return {
          label: '',
          unit: '',
          color: '#9ca3af',
          domain: [0, 100]
        };
    }
  };
  
  const config = getChartConfig();
  
  const formatYAxis = (value: number) => {
    return `${value}${config.unit}`;
  };
  
  const formatTooltip = (value: any) => {
    if (type === 'bloodPressure' && typeof value === 'object') {
      return `${value.systolic}/${value.diastolic} mmHg`;
    }
    return `${value} ${config.unit}`;
  };

  const renderTooltipContent = (props: any) => {
    const { payload, label } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-sm">
          <p className="font-medium">{label}</p>
          {type === 'bloodPressure' ? (
            <p className="text-gray-600">{`${data.value.systolic}/${data.value.diastolic} mmHg`}</p>
          ) : (
            <p className="text-gray-600">{`${data.value} ${config.unit}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-60">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium">{config.label}</h3>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatYAxis}
            domain={config.domain}
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip content={renderTooltipContent} />
          {type === 'bloodPressure' ? (
            <>
              <Line 
                type="monotone" 
                dataKey={(dataPoint) => dataPoint.value.systolic} 
                stroke={config.color} 
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey={(dataPoint) => dataPoint.value.diastolic} 
                stroke={config.colorSecondary} 
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
              />
            </>
          ) : (
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={config.color} 
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VitalsChart;
