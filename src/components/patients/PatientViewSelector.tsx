
import React from 'react';
import { usePatientViewSelector } from '@/hooks/usePatientViewSelector';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { ErrorMessage } from '@/components/ui/error-message';

interface PatientViewSelectorProps {
  patientId: string;
}

const PatientViewSelector: React.FC<PatientViewSelectorProps> = ({ patientId }) => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  // Use our hook to determine which view to render
  const { ViewComponent, userRole } = usePatientViewSelector(patientId);
  
  // Check if the user has permission to view patient data
  const canViewPatient = permissions.canAccessPatientData(patientId);
  
  if (!canViewPatient) {
    return (
      <ErrorMessage 
        title="Access Denied" 
        message="You don't have permission to view this patient's data." 
        variant="destructive"
      />
    );
  }
  
  // Render the selected view component
  return <ViewComponent patientId={patientId} />;
};

export default PatientViewSelector;
