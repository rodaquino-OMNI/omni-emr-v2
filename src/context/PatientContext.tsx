
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Patient } from '@/types/patientTypes';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useSectorContext } from '@/hooks/useSectorContext';
import { toast } from 'sonner';

interface PatientContextType {
  patient: Patient | null;
  isLoading: boolean;
  error: string | null;
  refreshPatient: () => Promise<void>;
  canEdit: boolean;
  canView: boolean;
}

interface PatientProviderProps {
  children: ReactNode;
  patientId?: string;
}

const PatientContext = createContext<PatientContextType>({
  patient: null,
  isLoading: false,
  error: null,
  refreshPatient: async () => {},
  canEdit: false,
  canView: false,
});

export const PatientProvider: React.FC<PatientProviderProps> = ({ children, patientId: propPatientId }) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const { selectedSector, sectorPatients } = useSectorContext();
  
  // Use patientId from props or route params
  const patientId = propPatientId || params.patientId;
  
  // Check user permissions for this patient
  const canView = Boolean(
    user && 
    patientId && 
    (permissions.canAccessPatientData(patientId) || 
     permissions.hasPermission('view_all_patients'))
  );
  
  const canEdit = Boolean(
    user && 
    patientId && 
    (permissions.hasPermission('edit_patient_data') ||
     permissions.hasPermission('admin'))
  );
  
  // Fetch patient data
  const fetchPatient = async () => {
    if (!patientId) {
      setError('No patient ID specified');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First check if patient is in the current sector's patients
      const sectorPatient = sectorPatients.find(p => p.id === patientId);
      
      if (sectorPatient) {
        // Convert SectorPatient to Patient
        const patientData: Patient = {
          id: sectorPatient.id,
          first_name: sectorPatient.first_name,
          last_name: sectorPatient.last_name,
          date_of_birth: sectorPatient.date_of_birth,
          gender: sectorPatient.gender || 'unknown',
          mrn: sectorPatient.mrn,
          status: sectorPatient.status as any, // Type conversion, we know these statuses map
          email: null,
          phone: null,
          address: null,
          insurance: null,
          allergies: [],
          medical_conditions: [],
          medications: [],
          emergency_contact: null,
          primary_care_provider: null,
          notes: null,
          blood_type: null
        };
        
        setPatient(patientData);
        setIsLoading(false);
      } else {
        // If not in sector patients, we would fetch from API
        // For now, show an error
        setError('Patient not found in current sector');
        setIsLoading(false);
        
        // Redirect back to patients list after a delay
        setTimeout(() => {
          toast.error('Patient not found in current sector');
          navigate('/patients');
        }, 2000);
      }
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError('Failed to fetch patient data');
      setIsLoading(false);
    }
  };
  
  // Refresh patient data
  const refreshPatient = async () => {
    await fetchPatient();
  };
  
  // Load patient on mount or when patientId/sector changes
  useEffect(() => {
    if (patientId && selectedSector) {
      fetchPatient();
    }
  }, [patientId, selectedSector]);
  
  // Handle unauthorized access
  useEffect(() => {
    if (!isLoading && !canView && !error) {
      toast.error('You do not have permission to view this patient');
      navigate('/patients');
    }
  }, [isLoading, canView, error]);
  
  return (
    <PatientContext.Provider
      value={{
        patient,
        isLoading,
        error,
        refreshPatient,
        canEdit,
        canView
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatientContext = () => useContext(PatientContext);

export default PatientContext;
