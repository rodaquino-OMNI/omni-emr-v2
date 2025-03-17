
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, ClipboardCheck, Activity, Pill } from 'lucide-react';
import { usePatientsByStatus } from '@/hooks/usePatientsByStatus';
import { useSectorContext } from '@/hooks/useSectorContext';

const NurseDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSector } = useSectorContext();
  const { criticalPatients, stablePatients, loading } = usePatientsByStatus(selectedSector?.id);
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Nurse Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/patients')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Patients
          </Button>
          <Button onClick={() => navigate('/medications')} variant="outline">
            <Pill className="h-4 w-4 mr-2" />
            Medications
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <ClipboardCheck className="h-5 w-5 mr-2 text-primary" />
              Tasks Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Vital Signs Due</span>
                <span className="font-semibold">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Medications Due</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Fluid Balance Checks</span>
                <span className="font-semibold">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Administered medication</span>
                <span className="text-xs text-muted-foreground">Patient: Ana Oliveira</span>
                <span className="text-xs text-muted-foreground">15 minutes ago</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Recorded vital signs</span>
                <span className="text-xs text-muted-foreground">Patient: Pedro Costa</span>
                <span className="text-xs text-muted-foreground">30 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Pill className="h-5 w-5 mr-2 text-primary" />
              Medication Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">09:00 - Lisinopril 10mg</span>
                <span className="text-xs text-muted-foreground">Ana Oliveira - Room 205</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">09:30 - Insulin Regular 5 units</span>
                <span className="text-xs text-muted-foreground">Pedro Costa - Room 210</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">10:00 - Paracetamol 500mg</span>
                <span className="text-xs text-muted-foreground">Maria Silva - Room 201</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Patient Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="critical">
            <TabsList className="mb-4">
              <TabsTrigger value="critical">Critical Care</TabsTrigger>
              <TabsTrigger value="stable">Routine Care</TabsTrigger>
              <TabsTrigger value="pending">Pending Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="critical" className="space-y-4">
              {loading ? (
                <p>Loading critical patients...</p>
              ) : criticalPatients.length > 0 ? (
                criticalPatients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <h3 className="font-medium">{patient.first_name} {patient.last_name}</h3>
                      <p className="text-sm text-muted-foreground">Room: {patient.mrn.substring(0, 3)}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No critical patients assigned to you.</p>
              )}
            </TabsContent>
            
            <TabsContent value="stable" className="space-y-4">
              {loading ? (
                <p>Loading stable patients...</p>
              ) : stablePatients.length > 0 ? (
                stablePatients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <h3 className="font-medium">{patient.first_name} {patient.last_name}</h3>
                      <p className="text-sm text-muted-foreground">Room: {patient.mrn.substring(0, 3)}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/patients/${patient.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No stable patients assigned to you.</p>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">Vital Signs Check</h3>
                  <p className="text-sm text-muted-foreground">Ana Oliveira - Room 205</p>
                  <p className="text-sm text-muted-foreground">Due in 15 minutes</p>
                </div>
                <Button variant="ghost" size="sm">Complete</Button>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <div>
                  <h3 className="font-medium">Medication Administration</h3>
                  <p className="text-sm text-muted-foreground">Pedro Costa - Room 210</p>
                  <p className="text-sm text-muted-foreground">Due in 30 minutes</p>
                </div>
                <Button variant="ghost" size="sm">Complete</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NurseDashboard;
