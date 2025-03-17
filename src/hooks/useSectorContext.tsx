
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  SectorType, 
  SectorPatient, 
  SectorContextType, 
  SectorProviderProps 
} from '@/types/sectorTypes';
import { useSectorData } from './sector';
import { useSectorPatients } from './sector/useSectorPatients';
import { secureStorage } from '@/utils/secureStorage';
import { toast } from 'sonner';

const SectorContext = createContext<SectorContextType>({
  sectors: [],
  selectedSector: null,
  selectSector: () => {},
  isLoading: false,
  error: null,
  fetchSectors: async () => {},
  isCacheStale: false,
  sectorPatients: [],
  patientsLoading: false,
  refreshPatients: async () => {},
  assignPatient: async () => {},
  unassignPatient: async () => {},
});

export const SectorProvider: React.FC<SectorProviderProps> = ({ children }) => {
  const [selectedSector, setSelectedSector] = useState<SectorType | null>(null);
  const { user } = useAuth();
  
  // Use our custom hooks with caching
  const { sectors, isLoading, error, fetchSectors, isCacheStale } = useSectorData();
  
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
    
    // Use secureStorage instead of regular localStorage for better security
    secureStorage.setItem('selectedSector', sector);
    
    // Fetch patients for the selected sector
    fetchPatients(sector.id);
    
    toast.success(
      `Sector selected: ${sector.name}`,
      { description: `You are now viewing patients in the ${sector.name} sector` }
    );
    
    // Log sector selection for auditing (this could be expanded with more details)
    console.log(`Sector selected: ${sector.name} (${sector.id})`);
  };

  // Initialize: fetch sectors and load previously selected sector
  useEffect(() => {
    // Load previously selected sector from secureStorage
    const savedSector = secureStorage.getItem<SectorType | null>('selectedSector', null);
    
    if (savedSector) {
      try {
        setSelectedSector(savedSector);
        fetchPatients(savedSector.id);
      } catch (e) {
        console.error('Error loading saved sector:', e);
        secureStorage.removeItem('selectedSector');
      }
    }
  }, [fetchPatients]);

  return (
    <SectorContext.Provider
      value={{
        sectors,
        selectedSector,
        selectSector,
        isLoading,
        error,
        fetchSectors,
        isCacheStale,
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
