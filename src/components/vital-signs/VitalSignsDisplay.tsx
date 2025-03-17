
import React from 'react';
import { VitalSigns } from '@/types/patient';
import { format } from 'date-fns';

export interface VitalSignsDisplayProps {
  vitals: VitalSigns;
  showTime?: boolean;
  compact?: boolean;
}

export const VitalSignsDisplay: React.FC<VitalSignsDisplayProps> = ({
  vitals,
  showTime = false,
  compact = false
}) => {
  if (!vitals) return null;
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-2">
      {showTime && vitals.timestamp && (
        <div className="text-sm text-muted-foreground mb-2">
          Recorded: {formatDate(vitals.timestamp)}
          {vitals.recorded_by && ` by ${vitals.recorded_by}`}
        </div>
      )}
      
      <div className={`grid ${compact ? "grid-cols-2 gap-2" : "grid-cols-2 md:grid-cols-3 gap-4"}`}>
        {vitals.temperature && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Temperature</span>
            <span className="font-medium">{vitals.temperature}°C</span>
          </div>
        )}
        
        {(vitals.heart_rate || vitals.heart_rate === 0) && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Heart Rate</span>
            <span className="font-medium">{vitals.heart_rate} bpm</span>
          </div>
        )}
        
        {(vitals.respiratory_rate || vitals.respiratory_rate === 0) && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Respiratory Rate</span>
            <span className="font-medium">{vitals.respiratory_rate} breaths/min</span>
          </div>
        )}
        
        {(vitals.systolic_bp || vitals.blood_pressure_systolic) && (vitals.diastolic_bp || vitals.blood_pressure_diastolic) && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Blood Pressure</span>
            <span className="font-medium">{vitals.systolic_bp || vitals.blood_pressure_systolic}/{vitals.diastolic_bp || vitals.blood_pressure_diastolic} mmHg</span>
          </div>
        )}
        
        {(vitals.oxygen_saturation || vitals.o2_saturation) && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">O2 Saturation</span>
            <span className="font-medium">{vitals.oxygen_saturation || vitals.o2_saturation}%</span>
          </div>
        )}
        
        {(vitals.pain_level !== undefined) && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Pain Level</span>
            <span className="font-medium">{vitals.pain_level}/10</span>
          </div>
        )}
        
        {vitals.weight && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Weight</span>
            <span className="font-medium">{vitals.weight} kg</span>
          </div>
        )}
        
        {vitals.height && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Height</span>
            <span className="font-medium">{vitals.height} cm</span>
          </div>
        )}
        
        {vitals.bmi && (
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">BMI</span>
            <span className="font-medium">{vitals.bmi.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      {vitals.notes && (
        <div className="mt-2">
          <span className="text-sm text-muted-foreground">Notes</span>
          <p className="text-sm">{vitals.notes}</p>
        </div>
      )}
    </div>
  );
};
