
import React from 'react';
import PatientPrescriptions from '../PatientPrescriptions';
import { usePatientPrescriptions } from '../hooks/usePatientPrescriptions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeftRight } from 'lucide-react';

interface PatientPrescriptionsTabProps {
  patientId: string;
  prescriptions?: any[];
  loading?: boolean;
}

const PatientPrescriptionsTab: React.FC<PatientPrescriptionsTabProps> = ({ 
  patientId,
  prescriptions: externalPrescriptions,
  loading: externalLoading
}) => {
  // Use the FHIR-compatible hook if external prescriptions aren't provided
  const { prescriptions: fetchedPrescriptions, loading: fetchLoading, dataStats } = usePatientPrescriptions(patientId);
  
  // Use either the externally provided data or the data from the hook
  const prescriptions = externalPrescriptions || fetchedPrescriptions;
  const loading = externalLoading !== undefined ? externalLoading : fetchLoading;

  return (
    <div className="space-y-4">
      {dataStats && dataStats.hasDualSources && (
        <Alert variant="default" className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <ArrowLeftRight className="h-4 w-4 text-blue-600" />
          <AlertTitle>Data Compatibility Active</AlertTitle>
          <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
            This patient has prescriptions in both FHIR ({dataStats.fhirCount}) and legacy ({dataStats.legacyCount}) formats. 
            Our system automatically normalizes and displays them in a unified view.
          </AlertDescription>
        </Alert>
      )}
      
      <PatientPrescriptions 
        patientId={patientId} 
        prescriptions={prescriptions} 
        loading={loading} 
      />
    </div>
  );
};

export default PatientPrescriptionsTab;
