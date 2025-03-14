
import React from 'react';
import PatientOverview from '../PatientOverview';

interface PatientOverviewTabProps {
  patientId: string;
  insights: any[];
  prescriptions: any[];
}

const PatientOverviewTab: React.FC<PatientOverviewTabProps> = ({ 
  patientId, 
  insights, 
  prescriptions 
}) => {
  return (
    <PatientOverview 
      patientId={patientId} 
      insights={insights} 
      prescriptions={prescriptions} 
    />
  );
};

export default PatientOverviewTab;
