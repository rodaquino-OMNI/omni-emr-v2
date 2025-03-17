import React, { createContext, useContext, useState } from 'react';
import { usePatients } from './usePatients';
import { Patient } from '@/types/patientTypes';

// Create mock hooks if they don't exist
const useCreatePatient = () => {
  return {
    createPatient: async (patient: Partial<Patient>) => {
      console.log('Create patient not implemented', patient);
      return { id: 'mock-id' };
    },
    isLoading: false
  };
};

const useUpdatePatient = () => {
  return {
    updatePatient: async (id: string, data: Partial<Patient>) => {
      console.log('Update patient not implemented', id, data);
      return { id };
    },
    isLoading: false
  };
};

const useDeletePatient = () => {
  return {
    deletePatient: async (id: string) => {
      console.log('Delete patient not implemented', id);
      return { id };
    },
    isLoading: false
  };
};

interface PatientsContextProps {
  patients: Patient[];
  isLoading: boolean;
  error: Error | null;
  updateFilters: (newFilters: Record<string, any>) => void;
  filters: Record<string, any>;
}

const PatientsContext = createContext<PatientsContextProps | undefined>(undefined);

export const PatientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const patientsQuery = usePatients();
  
  // Fix properties
  const patients = patientsQuery.patients || [];
  const isLoading = patientsQuery.loading || false;
  const error = patientsQuery.error || null;
  
  // Convert string error to Error object if needed
  const errorObject = error ? new Error(error as string) : null;
  
  const { updateFilters, filters } = patientsQuery;
  
  return (
    <PatientsContext.Provider value={{ patients, isLoading, error: errorObject, updateFilters, filters }}>
      {children}
    </PatientsContext.Provider>
  );
};

const usePatientsContext = () => {
  const patientsQuery = usePatients();
  
  // Fix properties
  const patients = patientsQuery.patients || [];
  const isLoading = patientsQuery.loading || false;
  const error = patientsQuery.error || null;
  
  // Convert string error to Error object if needed
  const errorObject = error ? new Error(error as string) : null;
  
  const { updateFilters, filters } = patientsQuery;

  return {
    patients,
    isLoading,
    error: errorObject,
    updateFilters,
    filters
  };
};

export const usePatientsData = () => {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error("usePatientsData must be used within a PatientsProvider");
  }
  return context;
};

export { usePatientsContext };
