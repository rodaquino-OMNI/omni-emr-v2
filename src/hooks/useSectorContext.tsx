
import React, { createContext, useContext, useState, useEffect } from 'react';
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
    console.log('[DEBUG] selectSector called with:', JSON.stringify(sector, null, 2));
    console.log('[DEBUG] Sector object type:', typeof sector);
    console.log('[DEBUG] Sector object keys:', Object.keys(sector));
    
    try {
      setSelectedSector(sector);
      console.log('[DEBUG] setSelectedSector completed');
      
      // Use secureStorage instead of regular localStorage for better security
      try {
        console.log('[DEBUG] About to call secureStorage.setItem with sector:',
          JSON.stringify(sector, null, 2));
        
        // Create a clean copy of the sector object to avoid potential circular references
        const sectorForStorage = {
          id: sector.id,
          name: sector.name,
          code: sector.code,
          description: sector.description || '',
          is_active: sector.is_active
        };
        
        console.log('[DEBUG] Using sanitized sector object for storage:',
          JSON.stringify(sectorForStorage, null, 2));
        
        secureStorage.setItem('selectedSector', sectorForStorage);
        console.log('[DEBUG] secureStorage.setItem completed successfully');
      } catch (storageError) {
        console.error('[DEBUG] Error storing sector in secureStorage:', storageError);
        console.error('[DEBUG] Error details:', storageError instanceof Error ? storageError.message : 'Unknown error');
        console.error('[DEBUG] Error stack:', storageError instanceof Error ? storageError.stack : 'No stack available');
        // Continue execution even if storage fails
      }
      
      // Fetch patients for the selected sector
      try {
        console.log('[DEBUG] About to call fetchPatients with sector ID:', sector.id);
        
        // Wrap the fetchPatients call in a try-catch to get more detailed error information
        const fetchPatientsPromise = fetchPatients(sector.id);
        console.log('[DEBUG] fetchPatients call initiated');
        
        // Add a timeout to detect if fetchPatients is hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('fetchPatients timeout after 5 seconds'));
          }, 5000);
        });
        
        // Race the fetchPatients promise against the timeout
        Promise.race([fetchPatientsPromise, timeoutPromise])
          .then(() => {
            console.log('[DEBUG] fetchPatients completed successfully');
          })
          .catch((error) => {
            console.error('[DEBUG] fetchPatients promise rejected:', error);
            console.error('[DEBUG] Error details:', error instanceof Error ? error.message : 'Unknown error');
            console.error('[DEBUG] Error stack:', error instanceof Error ? error.stack : 'No stack available');
          });
      } catch (fetchError) {
        console.error('[DEBUG] Error in fetchPatients try-catch block:', fetchError);
        console.error('[DEBUG] Error details:', fetchError instanceof Error ? fetchError.message : 'Unknown error');
        console.error('[DEBUG] Error stack:', fetchError instanceof Error ? fetchError.stack : 'No stack available');
        // Continue execution even if fetching patients fails
      }
      
      toast.success(
        `Sector selected: ${sector.name}`,
        { description: `You are now viewing patients in the ${sector.name} sector` }
      );
      console.log('[DEBUG] Toast notification displayed');
      
      // Log sector selection for auditing (this could be expanded with more details)
      console.log(`[INFO] Sector selected: ${sector.name} (${sector.id})`);
    } catch (error) {
      console.error('[DEBUG] Critical error in selectSector:', error);
      toast.error('Failed to select sector. Please try again.');
    }
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
