
import React from 'react';
import PatientRecords from '../PatientRecords';

interface PatientRecordsTabProps {
  patientId: string;
}

const PatientRecordsTab: React.FC<PatientRecordsTabProps> = ({ patientId }) => {
  return <PatientRecords patientId={patientId} />;
};

export default PatientRecordsTab;
