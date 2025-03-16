
import React from 'react';
import { VitalSigns } from '@/types/patientTypes';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Heart, Thermometer, Lungs, Activity, Weight, ArrowUpRight } from 'lucide-react';

interface VitalSignsDisplayProps {
  vitals: VitalSigns;
  showTime?: boolean;
}

const VitalSignsDisplay: React.FC<VitalSignsDisplayProps> = ({ vitals, showTime = true }) => {
  const timestamp = vitals.timestamp ? new Date(vitals.timestamp) : new Date();
  
  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardHeader className="bg-muted/30 pb-2">
        <CardTitle className="text-md flex justify-between items-center">
          <span>Vital Signs</span>
          {showTime && (
            <Badge variant="outline" className="text-xs font-normal">
              {format(timestamp, 'MMM d, yyyy h:mm a')}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {vitals.temperature && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/30">
                <Thermometer className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Temperature</div>
                <div className="font-semibold">{vitals.temperature}°C</div>
              </div>
            </div>
          )}
          
          {vitals.heart_rate && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center dark:bg-pink-900/30">
                <Heart className="h-4 w-4 text-pink-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Heart Rate</div>
                <div className="font-semibold">{vitals.heart_rate} bpm</div>
              </div>
            </div>
          )}
          
          {vitals.respiratory_rate && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900/30">
                <Lungs className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Respiratory Rate</div>
                <div className="font-semibold">{vitals.respiratory_rate} bpm</div>
              </div>
            </div>
          )}
          
          {(vitals.blood_pressure_systolic && vitals.blood_pressure_diastolic) && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900/30">
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Blood Pressure</div>
                <div className="font-semibold">{vitals.blood_pressure_systolic}/{vitals.blood_pressure_diastolic} mmHg</div>
              </div>
            </div>
          )}
          
          {vitals.oxygen_saturation && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center dark:bg-cyan-900/30">
                <ArrowUpRight className="h-4 w-4 text-cyan-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">O2 Saturation</div>
                <div className="font-semibold">{vitals.oxygen_saturation}%</div>
              </div>
            </div>
          )}
          
          {vitals.weight && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center dark:bg-amber-900/30">
                <Weight className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Weight</div>
                <div className="font-semibold">{vitals.weight} kg</div>
              </div>
            </div>
          )}
        </div>
        
        {vitals.notes && (
          <div className="mt-4 text-sm border-t pt-3 border-dashed">
            <span className="text-xs text-muted-foreground">Notes:</span>
            <p className="mt-1">{vitals.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalSignsDisplay;
