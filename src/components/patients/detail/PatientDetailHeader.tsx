
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
  
  // Create a compatible patient object that matches what PatientHeader expects
  const patientHeaderProps = {
    ...patient,
    name: patient.name || `${patient.first_name} ${patient.last_name}`, // Ensure name is always defined
    age: patient.age || 0,
    roomNumber: patient.room_number,
    diagnosis: patient.diagnosis || 'No diagnosis',
    gender: patient.gender || 'Unknown'
  };

  return (
    <div className="space-y-4">
      <Button variant="secondary" onClick={() => navigate('/patients')}>
        Back to Patients
      </Button>
      
      <PatientHeader 
        patient={patientHeaderProps} 
        hasCriticalInsights={hasCriticalInsights} 
      />
    </div>
  );
};

export default PatientDetailHeader;
