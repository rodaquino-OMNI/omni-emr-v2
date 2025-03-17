
import React from 'react';
import PatientAIInsights from '../PatientAIInsights';

interface PatientAIInsightsTabProps {
  patientId: string;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({ patientId }) => {
  return (
    <PatientAIInsights 
      patientId={patientId}
    />
  );
};

export default PatientAIInsightsTab;
