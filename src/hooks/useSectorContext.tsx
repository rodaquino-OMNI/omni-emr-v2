
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  SectorType, 
  SectorPatient, 
  SectorContextType, 
  SectorProviderProps 
} from '@/types/sectorTypes';
import { useSectorData } from './sector/useSectorData';
import { useSectorPatients } from './sector/useSectorPatients';

const SectorContext = createContext<SectorContextType>({
  sectors: [],
  selectedSector: null,
  selectSector: () => {},
  isLoading: false,
  error: null,
  fetchSectors: async () => {},
  sectorPatients: [],
  patientsLoading: false,
  refreshPatients: async () => {},
  assignPatient: async () => {},
  unassignPatient: async () => {},
});

export const SectorProvider: React.FC<SectorProviderProps> = ({ children }) => {
  const [selectedSector, setSelectedSector] = useState<SectorType | null>(null);
  const { user } = useAuth();
  
  // Use our custom hooks
  const { sectors, isLoading, error, fetchSectors } = useSectorData();
  
  const { 
    sectorPatients, 
    patientsLoading, 
    fetchPatients,
    refreshPatients,
    assignPatient,
    unassignPatient
  } = useSectorPatients(selectedSector, user?.id);

  // Select a sector and load its patients
  const selectSector = (sector: SectorType) => {
    setSelectedSector(sector);
    localStorage.setItem('selectedSector', JSON.stringify(sector));
    fetchPatients(sector.id);
  };

  // Initialize: fetch sectors and load previously selected sector
  useEffect(() => {
    fetchSectors();
    
    // Load previously selected sector from localStorage
    const savedSector = localStorage.getItem('selectedSector');
    if (savedSector) {
      try {
        const parsedSector = JSON.parse(savedSector);
        setSelectedSector(parsedSector);
        fetchPatients(parsedSector.id);
      } catch (e) {
        console.error('Error loading saved sector:', e);
        localStorage.removeItem('selectedSector');
      }
    }
  }, [fetchSectors]);

  return (
    <SectorContext.Provider
      value={{
        sectors,
        selectedSector,
        selectSector,
        isLoading,
        error,
        fetchSectors,
        sectorPatients,
        patientsLoading,
        refreshPatients,
        assignPatient,
        unassignPatient
      }}
    >
      {children}
    </SectorContext.Provider>
  );
};

export const useSectorContext = () => useContext(SectorContext);

export default SectorContext;
