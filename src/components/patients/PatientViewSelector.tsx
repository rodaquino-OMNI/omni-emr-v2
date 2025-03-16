
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
      return <DefaultPatientView />;
    }
    
    switch (user.role) {
      case 'doctor':
      case 'physician':
      case 'specialist':
        return <DoctorPatientView />;
        
      case 'nurse':
        return <NursePatientView />;
        
      case 'lab_technician':
      case 'radiology_technician':
      case 'medical_assistant':
        return <TechnicianPatientView />;
        
      default:
        return <DefaultPatientView />;
    }
  };
  
  return selectViewByRole();
};

export default PatientViewSelector;
