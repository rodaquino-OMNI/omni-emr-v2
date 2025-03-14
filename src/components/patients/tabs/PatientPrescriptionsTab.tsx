
import React from 'react';
import PatientPrescriptions from '../PatientPrescriptions';
import { usePatientPrescriptions } from '../hooks/usePatientPrescriptions';

interface PatientPrescriptionsTabProps {
  patientId: string;
}

const PatientPrescriptionsTab: React.FC<PatientPrescriptionsTabProps> = ({ 
  patientId
}) => {
  // Use the FHIR-compatible hook
  const { prescriptions, loading } = usePatientPrescriptions(patientId);

  return (
    <PatientPrescriptions 
      patientId={patientId} 
      prescriptions={prescriptions} 
      loading={loading} 
    />
  );
};

export default PatientPrescriptionsTab;
