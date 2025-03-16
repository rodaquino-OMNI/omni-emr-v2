
import React, { createContext, useContext, ReactNode } from 'react';
import { usePatients, usePatient, useCreatePatient, useUpdatePatient, useDeletePatient } from './usePatients';
import { Patient } from '@/types/patientTypes';
import { useSectorContext } from './useSectorContext';

interface PatientsContextType {
  patients: Patient[];
  isLoading: boolean;
  error: Error | null;
  createPatient: (newPatient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => Promise<Patient>;
  updatePatient: (updatedPatient: Partial<Patient> & { id: string }) => Promise<Patient>;
  deletePatient: (patientId: string) => Promise<string>;
  getPatient: (patientId: string) => Patient | undefined;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedSector } = useSectorContext();
  
  // Use our custom hooks for data fetching
  const { 
    data: patients = [], 
    isLoading, 
    error 
  } = usePatients(selectedSector?.id);
  
  const { mutateAsync: createPatientAsync } = useCreatePatient();
  const { mutateAsync: updatePatientAsync } = useUpdatePatient();
  const { mutateAsync: deletePatientAsync } = useDeletePatient();

  const createPatient = async (newPatient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    return await createPatientAsync(newPatient);
  };

  const updatePatient = async (updatedPatient: Partial<Patient> & { id: string }) => {
    return await updatePatientAsync(updatedPatient);
  };

  const deletePatient = async (patientId: string) => {
    return await deletePatientAsync(patientId);
  };

  const getPatient = (patientId: string) => {
    return patients.find(patient => patient.id === patientId);
  };

  return (
    <PatientsContext.Provider
      value={{
        patients,
        isLoading,
        error: error as Error | null,
        createPatient,
        updatePatient,
        deletePatient,
        getPatient
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
};

export const usePatientsContext = () => {
  const context = useContext(PatientsContext);
  if (context === undefined) {
    throw new Error('usePatientsContext must be used within a PatientsProvider');
  }
  return context;
};
