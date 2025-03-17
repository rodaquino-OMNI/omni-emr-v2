
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { usePatientData } from '@/hooks/usePatientData';
import { PatientViewProps } from '@/types/patient';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientVitalSignsTab from '../tabs/PatientVitalSignsTab';
import PatientAllergiesTab from '../tabs/PatientAllergiesTab';
import PatientMedicationsTab from '../tabs/PatientMedicationsTab';

const DefaultPatientView: React.FC<PatientViewProps> = ({ patientId }) => {
  const { data: patient, isLoading, error } = usePatientData(patientId);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !patient) {
    return (
      <Card className="mx-auto max-w-2xl p-6">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load patient details. {error?.toString()}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="allergies">Allergies</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Demographics</h3>
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground mr-2">Name:</span> {patient.first_name} {patient.last_name}</p>
                    <p><span className="text-muted-foreground mr-2">Date of Birth:</span> {patient.date_of_birth}</p>
                    <p><span className="text-muted-foreground mr-2">Gender:</span> {patient.gender}</p>
                    <p><span className="text-muted-foreground mr-2">MRN:</span> {patient.mrn}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <div className="space-y-1">
                    <p><span className="text-muted-foreground mr-2">Phone:</span> {patient.phone_number || patient.phone}</p>
                    <p><span className="text-muted-foreground mr-2">Email:</span> {patient.email}</p>
                    <p><span className="text-muted-foreground mr-2">Address:</span> {patient.address}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="allergies">
          <PatientAllergiesTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="medications">
          <PatientMedicationsTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DefaultPatientView;
