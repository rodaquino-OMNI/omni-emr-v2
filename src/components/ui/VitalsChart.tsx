
import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from '@/hooks/useTranslation';
import { Info, AlertTriangle } from 'lucide-react';
import { TimeRangeType, VitalType, VitalDataPoint } from '@/components/vitals/types/vitalsTypes';
import { generateMockVitalsData } from '@/components/vitals/utils/vitalsDataGenerator';
import { getVitalChartConfig } from '@/components/vitals/utils/vitalsChartConfig';
import VitalsChartTooltip from '@/components/vitals/components/VitalsChartTooltip';
import VitalsTimeRangeSelector from '@/components/vitals/components/VitalsTimeRangeSelector';
import VitalsChartLines from '@/components/vitals/components/VitalsChartLines';
import VitalsReferenceLines from '@/components/vitals/components/VitalsReferenceLines';

type VitalsChartProps = {
  patientId: string;
  type: VitalType;
  timeRange?: TimeRangeType;
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
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeType>(timeRange);
  const [showAbnormalAlert, setShowAbnormalAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    // Simulate network request
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const mockData = generateMockVitalsData(type, patientId, selectedTimeRange);
        setData(mockData);
        
        // Check if there are abnormal values to show alert
        const hasAbnormal = mockData.some(item => {
          if (type === 'bloodPressure') {
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
  
  const config = getVitalChartConfig(type, t);
  
  const formatYAxis = (value: number) => {
    return `${value}${config.unit}`;
  };
  
  const renderTooltipContent = (props: any) => {
    return <VitalsChartTooltip {...props} type={type} unit={config.unit} />;
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
          <VitalsTimeRangeSelector
            selectedTimeRange={selectedTimeRange}
            onChange={setSelectedTimeRange}
            size="sm"
          />
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
              
              <VitalsReferenceLines type={type} config={config} />
              <VitalsChartLines type={type} data={data} config={config} />
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
