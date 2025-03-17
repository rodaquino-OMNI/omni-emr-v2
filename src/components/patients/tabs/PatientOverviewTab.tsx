
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient } from '@/types/patient';
import { formatDate } from '@/utils/dateUtils';
import { usePatientData } from '@/hooks/usePatientData';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export interface PatientOverviewTabProps {
  patientId: string;
  patient?: Patient;
}

const PatientOverviewTab: React.FC<PatientOverviewTabProps> = ({ patientId, patient: propPatient }) => {
  // Fetch patient data if not provided as a prop
  const { patient: fetchedPatient, isLoading, error } = usePatientData(patientId, { enabled: !propPatient });
  
  // Use provided patient or fetched patient
  const patient = propPatient || fetchedPatient;

  if (isLoading) {
    return <PatientOverviewSkeleton />;
  }

  if (error || !patient) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-500">Error loading patient data: {error || 'Patient not found'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{patient.first_name} {patient.last_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium">{formatDate(new Date(patient.date_of_birth))}</p>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="text-sm font-medium">{patient.gender}</p>
            </div>
            {patient.mrn && (
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm text-muted-foreground">MRN</p>
                <p className="text-sm font-medium">{patient.mrn}</p>
              </div>
            )}
            {patient.phone && (
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{patient.phone}</p>
              </div>
            )}
            {patient.email && (
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{patient.email}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-sm font-medium">
                <Badge variant={patient.status === 'critical' ? 'destructive' : 
                               patient.status === 'unstable' ? 'warning' : 'default'}>
                  {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                </Badge>
              </p>
            </div>
            {patient.blood_type && (
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="text-sm font-medium">{patient.blood_type}</p>
              </div>
            )}
            {patient.height && (
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="text-sm font-medium">{patient.height} cm</p>
              </div>
            )}
            {patient.weight && (
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="text-sm font-medium">{patient.weight} kg</p>
              </div>
            )}
            {patient.allergies && patient.allergies.length > 0 && (
              <div className="grid grid-cols-2 gap-1">
                <p className="text-sm text-muted-foreground">Allergies</p>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((allergy, i) => (
                    <Badge key={i} variant="outline">{allergy}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add more sections as needed for complete patient overview */}
    </div>
  );
};

const PatientOverviewSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="grid grid-cols-2 gap-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="grid grid-cols-2 gap-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default PatientOverviewTab;
