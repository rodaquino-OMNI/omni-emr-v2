
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Pill, Droplets, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Medication {
  id: string;
  medicationName: string;
  scheduledTime: string;
  status: 'scheduled' | 'administered' | 'missed' | 'held';
  medicationType?: 'regular' | 'antibiotic' | 'analgesic' | 'critical' | 'prn';
  isIV?: boolean;
}

interface TimelineViewProps {
  medications: Medication[];
  onAdminister: (id: string) => void;
  onHold: (id: string) => void;
  onMissed: (id: string) => void;
  onCalculateIV: (id: string) => void;
  canAdminister: boolean;
}

const TimelineView = ({ 
  medications, 
  onAdminister, 
  onHold, 
  onMissed, 
  onCalculateIV,
  canAdminister 
}: TimelineViewProps) => {
  const { t } = useTranslation();
  
  // Create time blocks
  const timeBlocks = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });
  
  // Helper to determine medication color by type
  const getMedicationColor = (type?: string, status?: string) => {
    if (status === 'administered') return 'bg-green-100 border-green-400 text-green-800';
    if (status === 'missed') return 'bg-red-100 border-red-400 text-red-800';
    if (status === 'held') return 'bg-yellow-100 border-yellow-400 text-yellow-800';
    
    switch (type) {
      case 'antibiotic':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'analgesic':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'critical':
        return 'bg-red-100 border-red-400 text-red-800';
      case 'prn':
        return 'bg-purple-100 border-purple-400 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };
  
  // Helper to get the icon for medication type
  const getMedicationIcon = (medication: Medication) => {
    if (medication.isIV) return <Droplets className="h-3 w-3" />;
    if (medication.medicationType === 'critical') return <AlertCircle className="h-3 w-3" />;
    return <Pill className="h-3 w-3" />;
  };
  
  // Parse time string to get hour (for positioning)
  const getHourFromTime = (timeString: string): number => {
    const [hourStr] = timeString.split(':');
    return parseInt(hourStr, 10);
  };
  
  return (
    <Card className="p-4 overflow-x-auto">
      <h3 className="font-medium mb-3">{t('todaySchedule')}</h3>
      <div className="relative min-w-[800px]">
        {/* Timeline header */}
        <div className="flex border-b mb-2">
          <div className="w-24 flex-shrink-0">{t('medication')}</div>
          <div className="flex-1 flex">
            {timeBlocks.map((time) => (
              <div 
                key={time} 
                className="flex-1 text-xs text-center font-medium border-l"
              >
                {time}
              </div>
            ))}
          </div>
        </div>
        
        {/* Medications on timeline */}
        {medications.map((med) => {
          const hour = getHourFromTime(med.scheduledTime);
          
          return (
            <div key={med.id} className="flex items-center h-12 mb-2 relative">
              <div className="w-24 flex-shrink-0 text-xs font-medium truncate">
                {med.medicationName}
              </div>
              <div className="flex-1 flex relative">
                {/* Render medication dot at scheduled time */}
                <div 
                  className="absolute top-0 -mt-2"
                  style={{ 
                    left: `${(hour / 24) * 100}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center text-xs border rounded-full px-2 py-1 h-8",
                      getMedicationColor(med.medicationType, med.status)
                    )}
                  >
                    {getMedicationIcon(med)}
                    <span className="ml-1 truncate max-w-[100px]">{med.medicationName}</span>
                    
                    {med.status === 'scheduled' && canAdminister && (
                      <div className="ml-2 flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAdminister(med.id);
                          }}
                        >
                          ✓
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Time divisions */}
                {timeBlocks.map((time) => (
                  <div key={time} className="flex-1 border-l h-full" />
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Current time indicator */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-red-500"
          style={{ 
            left: `${(new Date().getHours() + new Date().getMinutes() / 60) / 24 * 100}%`,
          }}
        >
          <div className="bg-red-500 h-2 w-2 rounded-full -ml-1" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xs font-medium">{t('legend')}:</div>
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1" />
            <span className="text-xs">{t('administered')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-1" />
            <span className="text-xs">{t('scheduled')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1" />
            <span className="text-xs">{t('missed')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1" />
            <span className="text-xs">{t('held')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1" />
            <span className="text-xs">{t('critical')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
            <span className="text-xs">{t('antibiotic')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TimelineView;
