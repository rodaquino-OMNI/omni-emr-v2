
import React from 'react';
import { usePatientViewSelector } from '@/hooks/usePatientViewSelector';

interface PatientViewSelectorProps {
  patientId: string;
}

const PatientViewSelector: React.FC<PatientViewSelectorProps> = ({ patientId }) => {
  // Use our new hook to determine which view to render
  const { ViewComponent } = usePatientViewSelector(patientId);
  
  // Render the selected view component
  return <ViewComponent patientId={patientId} />;
};

export default PatientViewSelector;
