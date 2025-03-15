
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/hooks/useTranslation';
import { Heart, Activity, Thermometer, BarChart2, Droplet, Stethoscope } from 'lucide-react';

interface CurrentVitalsTabProps {
  loading?: boolean;
  patientId: string;
}

const CurrentVitalsTab: React.FC<CurrentVitalsTabProps> = ({ loading = false, patientId }) => {
  const { t } = useTranslation();
  
  // Mock data for demonstration
  const vitalsData = {
    heartRate: '78 bpm',
    bloodPressure: '120/80 mmHg',
    temperature: '36.6 °C',
    respiratoryRate: '18 rpm',
    oxygenSaturation: '98 %',
    painLevel: '0/10'
  };
  
  const vitalsSigns = [
    { 
      name: t('heartRate'), 
      value: vitalsData.heartRate, 
      icon: <Heart className="h-5 w-5 text-red-500" />,
      trend: 'stable'
    },
    { 
      name: t('bloodPressure'), 
      value: vitalsData.bloodPressure, 
      icon: <Activity className="h-5 w-5 text-blue-500" />,
      trend: 'stable'
    },
    { 
      name: t('temperature'), 
      value: vitalsData.temperature, 
      icon: <Thermometer className="h-5 w-5 text-orange-500" />,
      trend: 'stable'
    },
    { 
      name: t('respiratoryRate'), 
      value: vitalsData.respiratoryRate, 
      icon: <Stethoscope className="h-5 w-5 text-purple-500" />,
      trend: 'stable'
    },
    { 
      name: t('oxygenSaturation'), 
      value: vitalsData.oxygenSaturation, 
      icon: <Droplet className="h-5 w-5 text-blue-400" />,
      trend: 'stable'
    },
    { 
      name: t('painLevel'), 
      value: vitalsData.painLevel, 
      icon: <BarChart2 className="h-5 w-5 text-gray-500" />,
      trend: 'stable'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {vitalsSigns.map((vital, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-medium">
              {vital.name}
            </CardTitle>
            {vital.icon}
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{vital.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CurrentVitalsTab;
