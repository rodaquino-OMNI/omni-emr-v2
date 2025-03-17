
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Patient } from '@/types/patient';
import { usePatientData } from '@/hooks/usePatientData';
import { useSectorContext } from '@/hooks/useSectorContext';
import { ErrorMessage } from '@/components/ui/error-message';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

interface PatientContextType {
  patient: Patient | null;
  isLoading: boolean;
  error: string | null;
  patientId: string;
  canEdit: boolean;
  canView: boolean;
  refreshPatient: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType>({
  patient: null,
  isLoading: false,
  error: null,
  patientId: '',
  canEdit: false,
  canView: false,
  refreshPatient: async () => {}
});

interface PatientProviderProps {
  patientId?: string;
  children: React.ReactNode;
}

export const PatientProvider: React.FC<PatientProviderProps> = ({ patientId: externalPatientId, children }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedSector } = useSectorContext();
  
  // Get the patient ID either from props, params, or location state
  const patientId = externalPatientId || id || (location.state as any)?.patientId || '';
  
  // Fetch patient data
  const { patient, isLoading, error, fetchPatient } = usePatientData(patientId);
  
  // Check if user can edit or view this patient based on sector
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canView, setCanView] = useState<boolean>(false);
  
  useEffect(() => {
    if (patient && selectedSector) {
      // Check if patient is in the current sector
      setCanView(true); // For now, assume everyone can view
      
      // Check if user has edit permission for this patient
      setCanEdit(patient.is_assigned || false);
    }
  }, [patient, selectedSector]);
  
  // Define refreshPatient function to match the context type
  const refreshPatient = async () => {
    await fetchPatient();
  };
  
  // If loading, just return the children
  if (isLoading) {
    return <>{children}</>;
  }
  
  // If error or no patient ID, show error
  if ((error || !patientId) && !isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/patients')} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToPatients', 'Back to Patients')}
          </Button>
        </div>
        
        <ErrorMessage 
          title={t('patientNotFound', 'Patient Not Found')}
          message={error || t('noPatientId', 'No patient ID provided')}
        />
      </div>
    );
  }
  
  return (
    <PatientContext.Provider 
      value={{ 
        patient, 
        isLoading, 
        error, 
        patientId, 
        canEdit, 
        canView,
        refreshPatient
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);
