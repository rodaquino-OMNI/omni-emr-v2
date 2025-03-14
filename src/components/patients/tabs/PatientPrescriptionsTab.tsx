
import React from 'react';
import PatientPrescriptions from '../PatientPrescriptions';

interface PatientPrescriptionsTabProps {
  patientId: string;
  prescriptions: any[];
  loading: boolean;
}

const PatientPrescriptionsTab: React.FC<PatientPrescriptionsTabProps> = ({ 
  patientId, 
  prescriptions, 
  loading 
}) => {
  return (
    <PatientPrescriptions 
      patientId={patientId} 
      prescriptions={prescriptions} 
      loading={loading} 
    />
  );
};

export default PatientPrescriptionsTab;
