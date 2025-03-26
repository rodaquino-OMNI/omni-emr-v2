
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatientsByStatus, filterPatientsByStatus } from '@/hooks/usePatientsByStatus';
import { useSectorContext } from '@/hooks/useSectorContext';
import PatientList from '@/components/patients/PatientList';
import { PatientStatus } from '@/types/patientTypes';
import { Patient as PatientCardType } from '@/components/patients/PatientCard';
import { mapToPatientStatus } from '@/types/patientTypes';

const DoctorDashboard: React.FC = () => {
  const { selectedSector } = useSectorContext();
  const { data, loading, error } = usePatientsByStatus(selectedSector?.id);
  
  // Add debug logs for component rendering
  React.useEffect(() => {
    console.log('[DEBUG] DoctorDashboard rendering with:', {
      componentId: 'doctor-dashboard',
      selectedSector: selectedSector?.name,
      patientsCount: data?.length || 0,
      renderTime: new Date().toISOString()
    });
    
    // Log patient status types to help diagnose type issues
    if (data && data.length > 0) {
      console.log('[DEBUG] Patient status types:', {
        firstPatientStatus: data[0]?.status,
        statusType: typeof data[0]?.status,
        isValidEnum: ['active', 'inactive', 'discharged', 'critical', 'stable', 'hospital', 'home', 'improving'].includes(data[0]?.status)
      });
    }
  }, [selectedSector, data]);
  
  // Ensure patients have required properties with proper type handling
  const ensureRequiredProps = (patients: any[] = []): PatientCardType[] => {
    return patients.map(patient => {
      // Ensure status is properly mapped to a valid PatientStatus enum value
      const mappedStatus = mapToPatientStatus(patient.status || 'active');
      
      return {
        ...patient,
        name: patient.name || `${patient.first_name} ${patient.last_name}`,
        mrn: patient.mrn || '',
        age: patient.age || 0,
        gender: patient.gender || '',  // Keep gender as string to match PatientCardType
        status: mappedStatus  // Use the mapped status to ensure type compatibility
      };
    }) as PatientCardType[];
  };
  
  // Implement mutually exclusive filtering to prevent duplication
  const patientsByPriority = (patients: any[] = []) => {
    // Create a copy of the array to avoid mutating the original
    const patientsCopy = [...patients];
    
    // First, extract critical patients (highest priority)
    const critical = patientsCopy.filter(p =>
      p.status === 'critical' || p.status === 'hospital'
    );
    
    // Get the IDs of critical patients
    const criticalIds = critical.map(p => p.id);
    
    // Then get stable patients, excluding any that are already in the critical list
    const stable = patientsCopy.filter(p =>
      (p.status === 'stable' || p.status === 'improving') &&
      !criticalIds.includes(p.id)
    );
    
    return {
      critical,
      stable
    };
  };
  
  // Get patients with priority-based filtering to prevent duplication
  const { critical, stable } = patientsByPriority(data);
  
  // Ensure patients have required properties
  const criticalPatients = ensureRequiredProps(critical);
  const stablePatients = ensureRequiredProps(stable);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
      
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
            <CardTitle>Stable Patients</CardTitle>
            <CardDescription>Patients in stable condition</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientList 
              patients={stablePatients}
              isLoading={loading}
              error={error}
              emptyMessage="No stable patients at this time"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
