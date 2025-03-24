import React, { useState, useEffect } from 'react';
import { usePatientViewSelector } from '@/hooks/usePatientViewSelector';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { ErrorMessage } from '@/components/ui/error-message';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface PatientViewSelectorProps {
  patientId: string;
}

const PatientViewSelector: React.FC<PatientViewSelectorProps> = ({ patientId }) => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const [canViewPatient, setCanViewPatient] = useState<boolean | null>(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  
  // Use our hook to determine which view to render
  const { ViewComponent, userRole } = usePatientViewSelector(patientId);
  
  // Check if the user has permission to view patient data
  useEffect(() => {
    const checkPermission = async () => {
      setIsCheckingPermission(true);
      try {
        const hasPermission = await permissions.canAccessPatientData(patientId);
        setCanViewPatient(hasPermission);
      } catch (error) {
        console.error('Error checking patient access permission:', error);
        setCanViewPatient(false);
      } finally {
        setIsCheckingPermission(false);
      }
    };
    
    checkPermission();
  }, [patientId, permissions]);
  
  // Show loading state while checking permissions
  if (isCheckingPermission) {
    return <LoadingSpinner />;
  }
  
  // Show error if user doesn't have permission
  if (canViewPatient === false) {
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
