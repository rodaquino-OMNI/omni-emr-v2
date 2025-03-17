
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatientData } from '@/hooks/usePatientData';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import PatientOverviewTab from '../tabs/PatientOverviewTab';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface DefaultPatientViewProps {
  patientId: string;
}

const DefaultPatientView: React.FC<DefaultPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatientData(patientId);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !patient) {
    return <div className="p-4 text-red-500">Error loading patient: {error?.toString()}</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{patient.first_name} {patient.last_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p>{patient.date_of_birth}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p>{patient.gender}</p>
            </div>
            {patient.mrn && (
              <div>
                <p className="text-sm text-muted-foreground">MRN</p>
                <p>{patient.mrn}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Limited View</AlertTitle>
        <AlertDescription>
          This is a read-only view of basic patient information. 
          For more detailed access, please contact an administrator to update your role permissions.
        </AlertDescription>
      </Alert>
      
      <PatientOverviewTab patientId={patientId} patient={patient} />
    </div>
  );
};

export default DefaultPatientView;
