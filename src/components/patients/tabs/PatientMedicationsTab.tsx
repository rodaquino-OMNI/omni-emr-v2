
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { usePatientPrescriptions } from '@/hooks/usePatientPrescriptions';
import { Pill } from 'lucide-react';

interface PatientMedicationsTabProps extends PatientTabProps {
  compact?: boolean;
}

const PatientMedicationsTab: React.FC<PatientMedicationsTabProps> = ({ patientId, compact = false }) => {
  const { data: prescriptions, isLoading, error } = usePatientPrescriptions(patientId);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading medications: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Filter active medications from prescriptions
  const activeMedications = prescriptions?.flatMap(prescription => 
    prescription.items?.filter(item => 
      item.type === 'medication' && item.status === 'active'
    ) || []
  ) || [];
  
  if (activeMedications.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground flex items-center gap-2">
            <Pill className="h-4 w-4" />
            No active medications for this patient.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className={compact ? "pb-2" : "pb-4"}>
        <CardTitle className={compact ? "text-base" : "text-lg"}>Current Medications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeMedications.map((medication) => (
            <div key={medication.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="font-medium">{medication.name}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {medication.dosage && <span>{medication.dosage}</span>}
                {medication.frequency && <span> • {medication.frequency}</span>}
                {medication.duration && <span> • for {medication.duration}</span>}
              </div>
              {medication.instructions && (
                <div className="text-sm mt-1">{medication.instructions}</div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientMedicationsTab;
