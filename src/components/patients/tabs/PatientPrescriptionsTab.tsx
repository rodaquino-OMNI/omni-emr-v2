
import React from 'react';
import PatientPrescriptions from '../PatientPrescriptions';
import { usePatientPrescriptions } from '../hooks/usePatientPrescriptions';

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
  const { prescriptions: fetchedPrescriptions, loading: fetchLoading } = usePatientPrescriptions(patientId);
  
  // Use either the externally provided data or the data from the hook
  const prescriptions = externalPrescriptions || fetchedPrescriptions;
  const loading = externalLoading !== undefined ? externalLoading : fetchLoading;

  return (
    <PatientPrescriptions 
      patientId={patientId} 
      prescriptions={prescriptions} 
      loading={loading} 
    />
  );
};

export default PatientPrescriptionsTab;
