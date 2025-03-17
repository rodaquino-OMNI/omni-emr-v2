
import React from 'react';
import { VitalSigns } from '@/types/visitNotes';
import { format } from 'date-fns';

interface VitalSignsDisplayProps {
  data: VitalSigns;
  compact?: boolean;
  showTimestamp?: boolean;
}

export const VitalSignsDisplay: React.FC<VitalSignsDisplayProps> = ({
  data,
  compact = false,
  showTimestamp = true
}) => {
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {showTimestamp && data.timestamp && (
        <div className="text-sm text-muted-foreground">
          Recorded at {formatDate(data.timestamp)}
        </div>
      )}
      
      <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-3 gap-4'}`}>
        {data.temperature !== undefined && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Temperature</p>
            <p className="text-base">{data.temperature}°C</p>
          </div>
        )}
        
        {data.heartRate !== undefined && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
            <p className="text-base">{data.heartRate} bpm</p>
          </div>
        )}
        
        {data.respiratoryRate !== undefined && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Respiratory Rate</p>
            <p className="text-base">{data.respiratoryRate} breaths/min</p>
          </div>
        )}
        
        {data.bloodPressure && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Blood Pressure</p>
            <p className="text-base">{data.bloodPressure} mmHg</p>
          </div>
        )}
        
        {data.oxygenSaturation !== undefined && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">O₂ Saturation</p>
            <p className="text-base">{data.oxygenSaturation}%</p>
          </div>
        )}
        
        {data.pain !== undefined && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pain Level</p>
            <p className="text-base">{data.pain}/10</p>
          </div>
        )}
      </div>
    </div>
  );
};
