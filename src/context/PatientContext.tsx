
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Patient } from '@/types/patient';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useSectorContext } from '@/hooks/useSectorContext';
import { usePatientData } from '@/hooks/usePatientData';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { usePatientPrescriptions } from '@/hooks/usePatientPrescriptions';
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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const params = useParams();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  
  // Use sector context to check if patient is in selected sector
  const { selectedSector } = useSectorContext();
  
  // Use patientId from props or route params
  const patientId = propPatientId || params.id;
  
  // Fetch patient data using our optimized hook
  const { 
    patient, 
    isLoading: patientLoading, 
    error: patientError,
    fetchPatient
  } = usePatientData(patientId);
  
  // Fetch insights data with caching
  const { 
    insights, 
    isLoading: insightsLoading, 
    error: insightsError,
    refetchInsights
  } = usePatientInsights(patientId);
  
  // Fetch prescriptions data with caching
  const { 
    data: prescriptions, 
    isLoading: prescriptionsLoading,
    refetch: refetchPrescriptions
  } = usePatientPrescriptions(patientId);
  
  // Combined loading state
  const isLoading = patientLoading || insightsLoading || prescriptionsLoading;
  
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
  
  // Set error if patient data fetch fails
  useEffect(() => {
    if (patientError) {
      setError(patientError);
    }
  }, [patientError]);
  
  // Check if the patient belongs to the currently selected sector (for clinical staff)
  useEffect(() => {
    if (!isLoading && patient && selectedSector && 
        user && ['doctor', 'nurse', 'medical_staff'].includes(user.role)) {
      const patientInSector = patient.sectors?.some(s => s.id === selectedSector.id);
      
      if (!patientInSector) {
        toast.warning('Patient is not in your current sector', {
          description: 'You may need to change your selected sector to view this patient'
        });
      }
    }
  }, [isLoading, patient, selectedSector, user]);
  
  // Refresh patient data
  const refreshPatient = async () => {
    try {
      await Promise.all([
        fetchPatient(),
        refetchInsights(),
        refetchPrescriptions()
      ]);
      setError(null);
    } catch (err) {
      console.error('Error refreshing patient data:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to refresh patient data');
      }
    }
  };
  
  // Handle unauthorized access
  useEffect(() => {
    if (!isLoading && !canView && !error) {
      toast.error('You do not have permission to view this patient');
      navigate('/patients');
    }
  }, [isLoading, canView, error, navigate]);
  
  // Combine patient data with insights and prescriptions
  const combinedPatientData = patient ? {
    ...patient,
    insights: insights || [],
    prescriptions: prescriptions || []
  } : null;
  
  return (
    <PatientContext.Provider
      value={{
        patient: combinedPatientData,
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
