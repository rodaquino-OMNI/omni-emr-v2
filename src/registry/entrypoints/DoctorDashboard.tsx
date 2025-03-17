
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, ClipboardList, Stethoscope, Activity } from 'lucide-react';
import { usePatientsByStatus } from '@/hooks/usePatientsByStatus';
import { useSectorContext } from '@/hooks/useSectorContext';

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedSector } = useSectorContext();
  const { criticalPatients, stablePatients, loading } = usePatientsByStatus(selectedSector?.id);
  
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Physician Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate('/patients')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Patients
          </Button>
          <Button onClick={() => navigate('/clinical-documentation')} variant="outline">
            <ClipboardList className="h-4 w-4 mr-2" />
            Documentation
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Stethoscope className="h-5 w-5 mr-2 text-primary" />
              Clinical Workload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Critical Patients</span>
                <span className="font-semibold">{loading ? '...' : criticalPatients.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Stable Patients</span>
                <span className="font-semibold">{loading ? '...' : stablePatients.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Notes</span>
                <span className="font-semibold">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Updated treatment plan</span>
                <span className="text-xs text-muted-foreground">Patient: Maria Silva</span>
                <span className="text-xs text-muted-foreground">10 minutes ago</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Added lab results</span>
                <span className="text-xs text-muted-foreground">Patient: João Santos</span>
                <span className="text-xs text-muted-foreground">45 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <ClipboardList className="h-5 w-5 mr-2 text-primary" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">09:30 - Patient Consult</span>
                <span className="text-xs text-muted-foreground">Maria Silva</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">11:00 - Medical Team Meeting</span>
                <span className="text-xs text-muted-foreground">Conference Room B</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">14:15 - Follow-up Visit</span>
                <span className="text-xs text-muted-foreground">João Santos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader className="pb-2">
          <CardTitle>Patient Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="critical">
            <TabsList className="mb-4">
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="stable">Stable</TabsTrigger>
              <TabsTrigger value="discharged">Recently Discharged</TabsTrigger>
            </TabsList>
            
            <TabsContent value="critical" className="space-y-4">
              {loading ? (
                <p>Loading critical patients...</p>
              ) : criticalPatients.length > 0 ? (
                criticalPatients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <h3 className="font-medium">{patient.first_name} {patient.last_name}</h3>
                      <p className="text-sm text-muted-foreground">Last updated: 2 hours ago</p>
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
                      <p className="text-sm text-muted-foreground">MRN: {patient.mrn}</p>
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
            
            <TabsContent value="discharged" className="space-y-4">
              <p className="text-muted-foreground">No patients have been discharged recently.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
