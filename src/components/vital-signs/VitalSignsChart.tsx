
import React, { useMemo } from 'react';
import { VitalSigns } from '@/types/patientTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';

interface VitalSignsChartProps {
  vitals: VitalSigns[];
  timeRange?: 'day' | 'week' | 'month';
}

const VitalSignsChart: React.FC<VitalSignsChartProps> = ({ vitals, timeRange = 'week' }) => {
  const chartData = useMemo(() => {
    // Filter data based on time range
    const now = new Date();
    let filteredData = vitals;
    
    if (timeRange === 'day') {
      filteredData = vitals.filter(v => {
        const date = new Date(v.timestamp);
        return date >= subDays(now, 1);
      });
    } else if (timeRange === 'week') {
      filteredData = vitals.filter(v => {
        const date = new Date(v.timestamp);
        return date >= subDays(now, 7);
      });
    } else if (timeRange === 'month') {
      filteredData = vitals.filter(v => {
        const date = new Date(v.timestamp);
        return date >= subDays(now, 30);
      });
    }
    
    // Sort by timestamp
    return filteredData
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(v => ({
        name: format(new Date(v.timestamp), 'MMM d, h:mm a'),
        temperature: v.temperature,
        heartRate: v.heart_rate,
        respiratoryRate: v.respiratory_rate,
        oxygenSaturation: v.oxygen_saturation,
        systolic: v.blood_pressure_systolic,
        diastolic: v.blood_pressure_diastolic,
        timestamp: v.timestamp
      }));
  }, [vitals, timeRange]);
  
  if (chartData.length === 0) {
    return (
      <Card className="border rounded-lg overflow-hidden">
        <CardHeader className="bg-muted/30 pb-2">
          <CardTitle className="text-md">Vital Signs Trends</CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-48 flex items-center justify-center">
          <p className="text-muted-foreground">No vital signs data available for the selected time range.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardHeader className="bg-muted/30 pb-2">
        <CardTitle className="text-md">Vital Signs Trends</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  if (timeRange === 'day') {
                    return format(new Date(value), 'h:mm a');
                  } else {
                    return format(new Date(value), 'MMM d');
                  }
                }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  const formattedName = {
                    heartRate: 'Heart Rate',
                    respiratoryRate: 'Respiratory Rate',
                    oxygenSaturation: 'O2 Saturation',
                    temperature: 'Temperature',
                    systolic: 'Systolic BP',
                    diastolic: 'Diastolic BP'
                  }[name] || name;
                  
                  const unit = {
                    heartRate: 'bpm',
                    respiratoryRate: 'bpm',
                    oxygenSaturation: '%',
                    temperature: '°C',
                    systolic: 'mmHg',
                    diastolic: 'mmHg'
                  }[name] || '';
                  
                  return [`${value} ${unit}`, formattedName];
                }}
                labelFormatter={(label) => {
                  return `Time: ${label}`;
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#e11d48" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="oxygenSaturation" name="O2 Saturation" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="temperature" name="Temperature" stroke="#f97316" strokeWidth={2} />
              <Line type="monotone" dataKey="respiratoryRate" name="Respiratory Rate" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="systolic" name="Systolic BP" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="diastolic" name="Diastolic BP" stroke="#64748b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalSignsChart;
