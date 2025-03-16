
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import PatientHeader from '@/components/patients/PatientHeader';
import { Patient } from '@/types/patientTypes';

interface PatientDetailHeaderProps {
  patient: Patient;
  hasCriticalInsights: boolean;
}

const PatientDetailHeader = ({ patient, hasCriticalInsights }: PatientDetailHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Button variant="secondary" onClick={() => navigate('/patients')}>
        Back to Patients
      </Button>
      
      <PatientHeader 
        patient={patient} 
        hasCriticalInsights={hasCriticalInsights} 
      />
    </div>
  );
};

export default PatientDetailHeader;
