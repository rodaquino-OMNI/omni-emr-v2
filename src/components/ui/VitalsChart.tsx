import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/hooks/useTranslation';
import { Info, AlertTriangle } from 'lucide-react';

interface TimeRangeType {
  value: string;
  label: string;
}

interface VitalDataPoint {
  date: string;
  value: number | { systolic: number; diastolic: number; isAbnormal?: boolean };
  isAbnormal?: boolean;
}

type VitalType = 'heartRate' | 'bloodPressure' | 'temperature' | 'oxygenSaturation' | 'respiratoryRate';

type VitalsChartProps = {
  patientId: string;
  type: VitalType;
  timeRange?: string;
  height?: number;
  showTimeSelector?: boolean;
};

const VitalsChart: React.FC<VitalsChartProps> = ({ 
  patientId, 
  type, 
  timeRange = '7d',
  height = 240,
  showTimeSelector = false
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<VitalDataPoint[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>(timeRange);
  const [showAbnormalAlert, setShowAbnormalAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    // Simulate network request
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Mock data for demo purposes
        const mockData: VitalDataPoint[] = [
          { date: '2023-05-01', value: 72, isAbnormal: false },
          { date: '2023-05-02', value: 74, isAbnormal: false },
          { date: '2023-05-03', value: 75, isAbnormal: false },
          { date: '2023-05-04', value: 78, isAbnormal: true },
          { date: '2023-05-05', value: 73, isAbnormal: false },
        ];
        
        setData(mockData);
        
        // Check if there are abnormal values to show alert
        const hasAbnormal = mockData.some(item => {
          if (type === 'bloodPressure' && typeof item.value === 'object') {
            return item.value.isAbnormal;
          }
          return item.isAbnormal;
        });
        
        setShowAbnormalAlert(hasAbnormal);
      } catch (error) {
        console.error('Error fetching vitals data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [type, patientId, selectedTimeRange]);
  
  // Mock configuration for the chart (would come from a real function in a real app)
  const config = {
    label: type === 'heartRate' ? 'Heart Rate' : 
           type === 'bloodPressure' ? 'Blood Pressure' :
           type === 'temperature' ? 'Temperature' :
           type === 'oxygenSaturation' ? 'Oxygen Saturation' : 'Respiratory Rate',
    unit: type === 'heartRate' ? 'bpm' :
          type === 'bloodPressure' ? 'mmHg' :
          type === 'temperature' ? '°C' :
          type === 'oxygenSaturation' ? '%' : 'bpm',
    normalRange: [60, 100],
    normalSystolic: [90, 120],
    normalDiastolic: [60, 80],
    domain: [
      (dataMin: number) => Math.floor(dataMin * 0.95),
      (dataMax: number) => Math.ceil(dataMax * 1.05)
    ] as any
  };
  
  const formatYAxis = (value: number) => {
    return `${value}${config.unit}`;
  };
  
  const renderTooltipContent = (props: any) => {
    return <div className="bg-white p-2 border rounded shadow-sm text-xs">
      <p className="font-medium">{props.label}</p>
      {props.payload && props.payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {entry.value} {config.unit}
        </p>
      ))}
    </div>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{config.label}</h3>
          {showAbnormalAlert && (
            <div className="flex items-center">
              <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full flex items-center gap-0.5">
                <AlertTriangle className="h-3 w-3" />
                {t('abnormalDetected')}
              </span>
            </div>
          )}
        </div>
        
        {showTimeSelector && (
          <div className="flex gap-1">
            <button
              className={`text-xs px-2 py-1 rounded ${selectedTimeRange === '1d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setSelectedTimeRange('1d')}
            >
              24h
            </button>
            <button
              className={`text-xs px-2 py-1 rounded ${selectedTimeRange === '7d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setSelectedTimeRange('7d')}
            >
              7d
            </button>
            <button
              className={`text-xs px-2 py-1 rounded ${selectedTimeRange === '30d' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              onClick={() => setSelectedTimeRange('30d')}
            >
              30d
            </button>
          </div>
        )}
      </div>
      
      <div style={{ height: `${height}px` }} className="relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded">
            <div className="h-6 w-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tickFormatter={formatYAxis}
                domain={config.domain}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={renderTooltipContent} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded">
            <p className="text-sm text-muted-foreground">{t('noDataAvailable')}</p>
          </div>
        )}
      </div>
      
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <Info className="h-3 w-3 mr-1" />
        {type === 'bloodPressure' ? (
          <span>
            {t('normalRange')}: {t('systolic')} {config.normalSystolic?.[0]}-{config.normalSystolic?.[1]} {config.unit}, {t('diastolic')} {config.normalDiastolic?.[0]}-{config.normalDiastolic?.[1]} {config.unit}
          </span>
        ) : (
          <span>
            {t('normalRange')}: {config.normalRange?.[0]}-{config.normalRange?.[1]} {config.unit}
          </span>
        )}
      </div>
    </div>
  );
};

export default VitalsChart;
