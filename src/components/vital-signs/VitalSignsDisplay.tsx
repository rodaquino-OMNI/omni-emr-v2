
import React from 'react';
import { format } from 'date-fns';
import { VitalSigns } from '@/types/patient';
import { VitalSignsDisplayProps } from '@/components/vital-signs/types';

/**
 * Component to display vital signs with a consistent interface
 */
export const VitalSignsDisplay: React.FC<VitalSignsDisplayProps> = ({
  vitals,
  showTime = false,
  isCompact = false
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, showTime ? 'MMM d, yyyy h:mm a' : 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Determine which BP fields to use (handle both naming conventions)
  const systolic = vitals.blood_pressure_systolic ?? vitals.systolic_bp;
  const diastolic = vitals.blood_pressure_diastolic ?? vitals.diastolic_bp;
  const o2 = vitals.oxygen_saturation ?? vitals.o2_saturation;

  return (
    <div className="w-full">
      {showTime && vitals.timestamp && (
        <div className="text-sm text-muted-foreground mb-2">
          {formatDate(vitals.timestamp)}
        </div>
      )}
      
      <div className={`grid ${isCompact ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-4 gap-4'}`}>
        {vitals.temperature && (
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Temperature</div>
            <div className="font-medium">{vitals.temperature}°{vitals.temperature_unit || 'C'}</div>
          </div>
        )}
        
        {vitals.heart_rate && (
          <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Heart Rate</div>
            <div className="font-medium">{vitals.heart_rate} bpm</div>
          </div>
        )}
        
        {systolic && diastolic && (
          <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Blood Pressure</div>
            <div className="font-medium">{systolic}/{diastolic} mmHg</div>
          </div>
        )}
        
        {o2 && (
          <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">O₂ Saturation</div>
            <div className="font-medium">{o2}%</div>
          </div>
        )}
        
        {vitals.respiratory_rate && (
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Respiratory Rate</div>
            <div className="font-medium">{vitals.respiratory_rate} bpm</div>
          </div>
        )}
        
        {vitals.weight && (
          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Weight</div>
            <div className="font-medium">{vitals.weight} kg</div>
          </div>
        )}
        
        {vitals.pain_level !== undefined && vitals.pain_level !== null && (
          <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-md">
            <div className="text-xs text-muted-foreground">Pain Level</div>
            <div className="font-medium">{vitals.pain_level}/10</div>
          </div>
        )}
      </div>
      
      {vitals.notes && !isCompact && (
        <div className="mt-3 text-sm">
          <span className="font-medium">Notes: </span>
          <span className="text-muted-foreground">{vitals.notes}</span>
        </div>
      )}
    </div>
  );
};

export default VitalSignsDisplay;
