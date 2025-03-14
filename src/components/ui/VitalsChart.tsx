import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTranslation } from '@/hooks/useTranslation';
import { Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type VitalsChartProps = {
  patientId: string;
  type: 'heartRate' | 'bloodPressure' | 'temperature' | 'oxygenSaturation' | 'respiratoryRate' | 'bloodGlucose' | 'pain';
  timeRange?: '24h' | '3d' | '7d' | '30d';
};

const generateMockVitalsData = (type: string, patientId: string, timeRange: string) => {
  const today = new Date();
  const data = [];
  
  let dataPoints = 7;
  let intervalHours = 24;
  
  switch(timeRange) {
    case '24h':
      dataPoints = 8;
      intervalHours = 3;
      break;
    case '3d':
      dataPoints = 9;
      intervalHours = 8;
      break;
    case '7d':
      dataPoints = 7;
      intervalHours = 24;
      break;
    case '30d':
      dataPoints = 10;
      intervalHours = 72;
      break;
  }
  
  for (let i = dataPoints - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setHours(date.getHours() - (i * intervalHours));
    
    let value;
    let isAbnormal = false;
    
    const patientSeed = parseInt(patientId) || 1;
    const timeSeed = i + 1;
    const randomFactor = Math.sin(patientSeed * timeSeed) * 10;
    
    const abnormalProbability = Math.random() < 0.15;
    
    switch (type) {
      case 'heartRate':
        value = Math.floor(80 + randomFactor);
        
        if (abnormalProbability) {
          value = Math.random() < 0.5 ? 
            Math.floor(40 + Math.random() * 15) : 
            Math.floor(110 + Math.random() * 40);
          isAbnormal = true;
        }
        break;
        
      case 'bloodPressure':
        const baselineSystolic = 120 + randomFactor;
        const baselineDiastolic = 80 + (randomFactor * 0.5);
        
        let systolic = Math.floor(baselineSystolic);
        let diastolic = Math.floor(baselineDiastolic);
        
        if (abnormalProbability) {
          if (Math.random() < 0.5) {
            systolic = Math.floor(80 + Math.random() * 10);
            diastolic = Math.floor(50 + Math.random() * 10);
          } else {
            systolic = Math.floor(150 + Math.random() * 30);
            diastolic = Math.floor(95 + Math.random() * 15);
          }
          isAbnormal = true;
        }
        
        value = { systolic, diastolic, isAbnormal };
        break;
        
      case 'temperature':
        value = (37 + randomFactor * 0.05).toFixed(1);
        
        if (abnormalProbability) {
          value = Math.random() < 0.5 ?
            (35.5 + Math.random() * 0.5).toFixed(1) :
            (38.5 + Math.random() * 1.5).toFixed(1);
          isAbnormal = true;
        }
        break;
        
      case 'oxygenSaturation':
        value = Math.min(100, Math.floor(97 + randomFactor * 0.3));
        
        if (abnormalProbability) {
          value = Math.floor(85 + Math.random() * 7);
          isAbnormal = true;
        }
        break;
        
      case 'respiratoryRate':
        value = Math.floor(16 + randomFactor * 0.4);
        
        if (abnormalProbability) {
          value = Math.random() < 0.5 ?
            Math.floor(8 + Math.random() * 3) :
            Math.floor(24 + Math.random() * 12);
          isAbnormal = true;
        }
        break;
        
      case 'bloodGlucose':
        value = Math.floor(85 + randomFactor * 1.5);
        
        if (abnormalProbability) {
          value = Math.random() < 0.5 ?
            Math.floor(40 + Math.random() * 25) :
            Math.floor(180 + Math.random() * 120);
          isAbnormal = true;
        }
        break;
        
      case 'pain':
        value = Math.floor(2 + randomFactor * 0.3);
        
        if (abnormalProbability) {
          value = Math.floor(7 + Math.random() * 3);
          isAbnormal = true;
        }
        
        value = Math.max(0, Math.min(10, value));
        break;
        
      default:
        value = 0;
    }
    
    const formattedDate = timeRange === '24h' ? 
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
      date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + 
      (timeRange === '3d' ? ' ' + date.toLocaleTimeString([], { hour: '2-digit' }) : '');
      
    data.push({
      date: formattedDate,
      timestamp: date.toISOString(),
      value,
      isAbnormal
    });
  }
  
  return data;
};

const VitalsChart = ({ patientId, type, timeRange = '7d' }: VitalsChartProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '3d' | '7d' | '30d'>(timeRange);
  
  useEffect(() => {
    const mockData = generateMockVitalsData(type, patientId, selectedTimeRange);
    setData(mockData);
  }, [type, patientId, selectedTimeRange]);
  
  const getChartConfig = () => {
    switch (type) {
      case 'heartRate':
        return {
          label: t('heartRate'),
          unit: t('bpm'),
          color: '#f43f5e',
          domain: [40, 160],
          normalRange: [60, 100],
          criticalLow: 50,
          criticalHigh: 120
        };
      case 'bloodPressure':
        return {
          label: t('bloodPressure'),
          unit: t('mmHg'),
          color: '#0ea5e9',
          colorSecondary: '#6366f1',
          domain: [40, 200],
          normalSystolic: [90, 140],
          normalDiastolic: [60, 90],
          criticalSystolic: { low: 80, high: 180 },
          criticalDiastolic: { low: 50, high: 120 }
        };
      case 'temperature':
        return {
          label: t('temperature'),
          unit: '°C',
          color: '#f97316',
          domain: [35, 40],
          normalRange: [36.5, 37.5],
          criticalLow: 35,
          criticalHigh: 39
        };
      case 'oxygenSaturation':
        return {
          label: t('oxygenSaturation'),
          unit: '%',
          color: '#10b981',
          domain: [80, 100],
          normalRange: [95, 100],
          criticalLow: 90,
          criticalHigh: 100
        };
      case 'respiratoryRate':
        return {
          label: t('respiratoryRate'),
          unit: t('breathsPerMinute'),
          color: '#9333ea',
          domain: [8, 40],
          normalRange: [12, 20],
          criticalLow: 8,
          criticalHigh: 30
        };
      case 'bloodGlucose':
        return {
          label: t('bloodGlucose'),
          unit: 'mg/dL',
          color: '#6366f1',
          domain: [40, 300],
          normalRange: [70, 140],
          criticalLow: 60,
          criticalHigh: 200
        };
      case 'pain':
        return {
          label: t('painLevel'),
          unit: '',
          color: '#ef4444',
          domain: [0, 10],
          normalRange: [0, 3],
          criticalHigh: 7
        };
      default:
        return {
          label: '',
          unit: '',
          color: '#9ca3af',
          domain: [0, 100],
          normalRange: [0, 100]
        };
    }
  };
  
  const config = getChartConfig();
  
  const formatYAxis = (value: number) => {
    return `${value}${config.unit}`;
  };
  
  const renderTooltipContent = (props: any) => {
    const { payload, label } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md text-sm">
          <p className="font-medium">{label}</p>
          {type === 'bloodPressure' ? (
            <>
              <p className={`text-gray-700 ${data.value.isAbnormal ? 'font-semibold text-red-600' : ''}`}>
                {`${t('systolic')}: ${data.value.systolic} ${config.unit}`}
              </p>
              <p className={`text-gray-700 ${data.value.isAbnormal ? 'font-semibold text-red-600' : ''}`}>
                {`${t('diastolic')}: ${data.value.diastolic} ${config.unit}`}
              </p>
            </>
          ) : (
            <p className={`text-gray-700 ${data.isAbnormal ? 'font-semibold text-red-600' : ''}`}>
              {`${data.value} ${config.unit}`}
            </p>
          )}
          
          {(type === 'bloodPressure' ? data.value.isAbnormal : data.isAbnormal) && (
            <div className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>{t('abnormalValue')}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  const hasAbnormalValues = data.some(item => {
    if (type === 'bloodPressure') {
      return item.value.isAbnormal;
    }
    return item.isAbnormal;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">{config.label}</h3>
          {hasAbnormalValues && (
            <div className="flex items-center">
              <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full flex items-center gap-0.5">
                <AlertTriangle className="h-3 w-3" />
                {t('abnormalDetected')}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant={selectedTimeRange === '24h' ? 'default' : 'outline'} 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={() => setSelectedTimeRange('24h')}
          >
            24h
          </Button>
          <Button 
            variant={selectedTimeRange === '3d' ? 'default' : 'outline'} 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={() => setSelectedTimeRange('3d')}
          >
            3d
          </Button>
          <Button 
            variant={selectedTimeRange === '7d' ? 'default' : 'outline'} 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={() => setSelectedTimeRange('7d')}
          >
            7d
          </Button>
          <Button 
            variant={selectedTimeRange === '30d' ? 'default' : 'outline'} 
            size="sm" 
            className="h-7 text-xs px-2"
            onClick={() => setSelectedTimeRange('30d')}
          >
            30d
          </Button>
        </div>
      </div>
      
      <div className="h-60">
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
            
            {type !== 'bloodPressure' && config.normalRange && (
              <ReferenceLine 
                y={config.normalRange[0]} 
                stroke="#94a3b8" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              />
            )}
            {type !== 'bloodPressure' && config.normalRange && (
              <ReferenceLine 
                y={config.normalRange[1]} 
                stroke="#94a3b8" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              />
            )}
            
            {type !== 'bloodPressure' && config.criticalLow && (
              <ReferenceLine 
                y={config.criticalLow} 
                stroke="#f43f5e" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              />
            )}
            {type !== 'bloodPressure' && config.criticalHigh && (
              <ReferenceLine 
                y={config.criticalHigh} 
                stroke="#f43f5e" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              />
            )}
            
            {type === 'bloodPressure' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="value.systolic" 
                  stroke={config.color} 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={({ value, index }: any) => {
                    const entry = data[index];
                    return (
                      <circle 
                        r={4} 
                        cx={0} 
                        cy={0} 
                        fill={entry.value.isAbnormal ? '#ef4444' : config.color}
                      />
                    );
                  }}
                  name={t('systolic')}
                />
                <Line 
                  type="monotone" 
                  dataKey="value.diastolic" 
                  stroke={config.colorSecondary} 
                  strokeWidth={2}
                  activeDot={{ r: 6 }}
                  dot={({ value, index }: any) => {
                    const entry = data[index];
                    return (
                      <circle 
                        r={4} 
                        cx={0} 
                        cy={0} 
                        fill={entry.value.isAbnormal ? '#ef4444' : config.colorSecondary}
                      />
                    );
                  }}
                  name={t('diastolic')}
                />
              </>
            ) : (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={config.color} 
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={({ value, index }: any) => {
                  const entry = data[index];
                  return (
                    <circle 
                      r={4} 
                      cx={0} 
                      cy={0} 
                      fill={entry.isAbnormal ? '#ef4444' : config.color}
                    />
                  );
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
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

