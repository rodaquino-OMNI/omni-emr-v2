
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import DoctorPatientView from './views/DoctorPatientView';
import NursePatientView from './views/NursePatientView';
import TechnicianPatientView from './views/TechnicianPatientView';
import DefaultPatientView from './views/DefaultPatientView';

interface PatientViewSelectorProps {
  patientId: string;
}

const PatientViewSelector: React.FC<PatientViewSelectorProps> = ({ patientId }) => {
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  // Determine which view to show based on user role
  const selectViewByRole = () => {
    if (!user || !user.role) {
      return <DefaultPatientView patientId={patientId} />;
    }
    
    switch (user.role) {
      case 'doctor':
      case 'physician':
      case 'specialist':
        return <DoctorPatientView patientId={patientId} />;
        
      case 'nurse':
        return <NursePatientView patientId={patientId} />;
        
      case 'lab_technician':
      case 'radiology_technician':
      case 'medical_assistant':
        return <TechnicianPatientView patientId={patientId} />;
        
      default:
        return <DefaultPatientView patientId={patientId} />;
    }
  };
  
  return selectViewByRole();
};

export default PatientViewSelector;
