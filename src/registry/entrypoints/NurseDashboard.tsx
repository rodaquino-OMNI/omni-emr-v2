
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatientsByStatus, filterPatientsByStatus } from '@/hooks/usePatientsByStatus';
import { useSectorContext } from '@/hooks/useSectorContext';
import PatientList from '@/components/patients/PatientList';
import { PatientStatus } from '@/types/patientTypes';

const NurseDashboard: React.FC = () => {
  const { selectedSector } = useSectorContext();
  const { data, loading, error } = usePatientsByStatus(selectedSector?.id);
  
  // Filter patients for nurse dashboard
  const criticalPatients = filterPatientsByStatus(data || [], ['critical', 'hospital']);
  const stablePatients = filterPatientsByStatus(data || [], ['stable', 'improving']);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nurse Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Critical Patients</CardTitle>
            <CardDescription>Patients requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientList 
              patients={criticalPatients}
              isLoading={loading}
              error={error}
              emptyMessage="No critical patients at this time"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Vital Signs Due</CardTitle>
            <CardDescription>Patients needing vital sign measurements</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientList 
              patients={stablePatients}
              isLoading={loading}
              error={error}
              emptyMessage="No patients need vital signs at this time"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NurseDashboard;
