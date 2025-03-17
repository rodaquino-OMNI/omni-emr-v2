
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePatientVitals } from '@/hooks/usePatientVitals';
import { PatientTabProps } from '@/types/patient';
import { VitalSignsDisplay } from '@/components/vital-signs/VitalSignsDisplay';

/**
 * Tab component to display patient vital signs
 * Uses standardized loading patterns and type definitions
 */
const PatientVitalSignsTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const { data: vitals, isLoading, error } = usePatientVitals(patientId);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading vital signs: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!vitals || vitals.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">No vital signs recorded for this patient.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Recent vitals at the top
  const latestVitals = vitals[0];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Latest Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          {latestVitals && <VitalSignsDisplay vitals={latestVitals} showTime={true} />}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Vital Signs History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {vitals.slice(1).map((vitalRecord) => (
              <div key={vitalRecord.id} className="border-b pb-4 last:border-0">
                <VitalSignsDisplay vitals={vitalRecord} showTime={true} />
              </div>
            ))}
            
            {vitals.length <= 1 && (
              <p className="text-muted-foreground">No historical vital signs available.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientVitalSignsTab;
