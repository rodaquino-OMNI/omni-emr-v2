
import React from 'react';
import PatientAIInsights from '../PatientAIInsights';

interface PatientAIInsightsTabProps {
  insights: any[];
  loading: boolean;
}

const PatientAIInsightsTab: React.FC<PatientAIInsightsTabProps> = ({ 
  insights, 
  loading 
}) => {
  return (
    <PatientAIInsights 
      insights={insights} 
      loading={loading} 
    />
  );
};

export default PatientAIInsightsTab;
