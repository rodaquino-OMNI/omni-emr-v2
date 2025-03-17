
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, AlertCircle } from 'lucide-react';
import { PatientTabProps } from '@/types/patient';
import { usePatientVitals } from '@/hooks/usePatientVitals';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VitalSignsForm from '@/components/vital-signs/VitalSignsForm';
import { useVitalSignsAbnormalities } from '@/hooks/useVitalSignsAbnormalities';
import AbnormalFindingsAlert from '@/components/vital-signs/AbnormalFindingsAlert';
import { toast } from 'sonner';
import { formatDate } from '@/utils/dateUtils';

const PatientVitalSignsTab: React.FC<PatientTabProps> = ({ patientId }) => {
  const { data: vitals, isLoading, refetch } = usePatientVitals(patientId);
  const [vitalsDialogOpen, setVitalsDialogOpen] = useState(false);
  
  const latestVitals = vitals && vitals.length > 0 ? vitals[0] : null;
  const { abnormalFindings, hasAbnormalFindings } = useVitalSignsAbnormalities(latestVitals);
  
  const handleVitalsSuccess = () => {
    setVitalsDialogOpen(false);
    toast.success("Vital signs recorded successfully");
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!vitals || vitals.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="text-center py-6">
          <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Vital Signs Recorded</h3>
          <p className="text-muted-foreground mb-4">
            There are no vital signs recorded for this patient yet.
          </p>
          <Button onClick={() => setVitalsDialogOpen(true)}>
            Record Vital Signs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Vital Signs</h2>
        <Button onClick={() => setVitalsDialogOpen(true)} className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Record New Vitals
        </Button>
      </div>
      
      {hasAbnormalFindings && (
        <AbnormalFindingsAlert findings={abnormalFindings} />
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex justify-between">
            <span>Latest Vital Signs</span>
            {latestVitals && (
              <span className="text-sm font-normal text-muted-foreground">
                Recorded: {formatDate(latestVitals.timestamp)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Temperature</div>
              <div className="text-xl font-semibold mt-1">
                {latestVitals?.temperature 
                  ? `${latestVitals.temperature}°C` 
                  : 'Not recorded'}
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Heart Rate</div>
              <div className="text-xl font-semibold mt-1">
                {latestVitals?.heart_rate
                  ? `${latestVitals.heart_rate} bpm`
                  : 'Not recorded'}
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Blood Pressure</div>
              <div className="text-xl font-semibold mt-1">
                {(latestVitals?.blood_pressure_systolic && latestVitals?.blood_pressure_diastolic)
                  ? `${latestVitals.blood_pressure_systolic}/${latestVitals.blood_pressure_diastolic} mmHg`
                  : 'Not recorded'}
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Oxygen Saturation</div>
              <div className="text-xl font-semibold mt-1">
                {latestVitals?.oxygen_saturation
                  ? `${latestVitals.oxygen_saturation}%`
                  : 'Not recorded'}
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Respiratory Rate</div>
              <div className="text-xl font-semibold mt-1">
                {latestVitals?.respiratory_rate
                  ? `${latestVitals.respiratory_rate} bpm`
                  : 'Not recorded'}
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-lg border">
              <div className="text-sm text-muted-foreground">Pain Level</div>
              <div className="text-xl font-semibold mt-1">
                {latestVitals?.pain_level !== undefined && latestVitals?.pain_level !== null
                  ? `${latestVitals.pain_level}/10`
                  : 'Not recorded'}
              </div>
            </div>
          </div>
          
          {latestVitals?.notes && (
            <div className="mt-4 p-3 bg-muted/50 rounded border">
              <div className="text-sm font-medium">Notes:</div>
              <div className="mt-1 text-sm">{latestVitals.notes}</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {vitals.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">Vital Sign History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Temp</th>
                    <th className="px-4 py-2 text-left">HR</th>
                    <th className="px-4 py-2 text-left">BP</th>
                    <th className="px-4 py-2 text-left">RR</th>
                    <th className="px-4 py-2 text-left">O₂</th>
                    <th className="px-4 py-2 text-left">Pain</th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.slice(0, 10).map((vital, index) => (
                    <tr key={vital.id} className="border-b">
                      <td className="px-4 py-2">{formatDate(vital.timestamp)}</td>
                      <td className="px-4 py-2">{vital.temperature ? `${vital.temperature}°C` : '-'}</td>
                      <td className="px-4 py-2">{vital.heart_rate ? `${vital.heart_rate}` : '-'}</td>
                      <td className="px-4 py-2">
                        {vital.blood_pressure_systolic && vital.blood_pressure_diastolic
                          ? `${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}`
                          : '-'}
                      </td>
                      <td className="px-4 py-2">{vital.respiratory_rate ? `${vital.respiratory_rate}` : '-'}</td>
                      <td className="px-4 py-2">{vital.oxygen_saturation ? `${vital.oxygen_saturation}%` : '-'}</td>
                      <td className="px-4 py-2">{vital.pain_level !== undefined ? `${vital.pain_level}/10` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Vital Signs Dialog */}
      <Dialog open={vitalsDialogOpen} onOpenChange={setVitalsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Vital Signs</DialogTitle>
          </DialogHeader>
          <VitalSignsForm 
            patientId={patientId}
            onClose={() => setVitalsDialogOpen(false)}
            onSuccess={handleVitalsSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientVitalSignsTab;
