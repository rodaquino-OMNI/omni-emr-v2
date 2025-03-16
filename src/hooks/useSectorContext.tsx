import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export interface SectorType {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface SectorPatient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string | null;
  mrn: string;
  status: string;
  is_assigned: boolean;
  room_number?: string | null;
}

export interface SectorContextType {
  sectors: SectorType[];
  selectedSector: SectorType | null;
  selectSector: (sector: SectorType) => void;
  isLoading: boolean;
  error: string | null;
  fetchSectors: () => Promise<void>;
  sectorPatients: SectorPatient[];
  patientsLoading: boolean;
  refreshPatients: () => Promise<void>;
  assignPatient: (patientId: string) => Promise<void>;
  unassignPatient: (patientId: string) => Promise<void>;
}

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

export interface SectorProviderProps {
  children: ReactNode;
}

export const SectorProvider: React.FC<SectorProviderProps> = ({ children }) => {
  const [sectors, setSectors] = useState<SectorType[]>([]);
  const [selectedSector, setSelectedSector] = useState<SectorType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sectorPatients, setSectorPatients] = useState<SectorPatient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState<boolean>(false);
  
  const { user } = useAuth();

  // Fetch sectors from Supabase
  const fetchSectors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock sectors if needed for development
      const mockSectors: SectorType[] = [
        { id: '1', name: 'Emergency Department', code: 'ED', is_active: true, description: 'Emergency care unit' },
        { id: '2', name: 'Intensive Care Unit', code: 'ICU', is_active: true, description: 'Critical care unit' },
        { id: '3', name: 'Cardiology', code: 'CARD', is_active: true, description: 'Heart care unit' },
        { id: '4', name: 'Pediatrics', code: 'PED', is_active: true, description: 'Child care unit' },
      ];
      
      // Try to fetch from Supabase if connected
      const { data, error } = await supabase
        .from('hospital_sectors')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching sectors:', error);
        // Fall back to mock data if there's an error
        setSectors(mockSectors);
      } else if (data && data.length > 0) {
        setSectors(data);
      } else {
        // If no data from Supabase, use mock data
        setSectors(mockSectors);
      }
    } catch (err) {
      console.error('Failed to fetch sectors:', err);
      setError('Failed to load sectors. Please try again later.');
      // Fall back to mock data
      setSectors([
        { id: '1', name: 'Emergency Department', code: 'ED', is_active: true, description: 'Emergency care unit' },
        { id: '2', name: 'Intensive Care Unit', code: 'ICU', is_active: true, description: 'Critical care unit' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch patients for the selected sector
  const fetchPatients = async (sectorId: string) => {
    if (!sectorId) return;
    
    try {
      setPatientsLoading(true);
      
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .rpc('get_sector_patients', { p_sector_id: sectorId });
      
      if (error) {
        console.error('Error fetching sector patients:', error);
        // Fall back to mock data
        const mockPatients: SectorPatient[] = [
          {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: '1980-05-15',
            gender: 'Male',
            mrn: 'MRN123456',
            status: 'active',
            is_assigned: true,
            room_number: '101'
          },
          {
            id: '2',
            first_name: 'Jane',
            last_name: 'Smith',
            date_of_birth: '1975-08-22',
            gender: 'Female',
            mrn: 'MRN789012',
            status: 'stable',
            is_assigned: false,
            room_number: '203'
          }
        ];
        setSectorPatients(mockPatients);
      } else {
        setSectorPatients(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err);
      // Fall back to mock data if there's an error
      setSectorPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  // Refresh patients data
  const refreshPatients = async () => {
    if (selectedSector) {
      await fetchPatients(selectedSector.id);
    }
  };

  // Select a sector and load its patients
  const selectSector = (sector: SectorType) => {
    setSelectedSector(sector);
    localStorage.setItem('selectedSector', JSON.stringify(sector));
    fetchPatients(sector.id);
  };

  // Assign a patient to the current user in the selected sector
  const assignPatient = async (patientId: string) => {
    if (!selectedSector || !user) return;
    
    try {
      // Try to assign in Supabase
      const { error } = await supabase
        .from('provider_patient_assignments')
        .insert([
          {
            patient_id: patientId,
            provider_id: user.id,
            sector_id: selectedSector.id,
            is_active: true
          }
        ]);
      
      if (error) {
        console.error('Error assigning patient:', error);
        throw new Error('Failed to assign patient');
      }
      
      // Update local state
      setSectorPatients(prev => 
        prev.map(p => p.id === patientId ? { ...p, is_assigned: true } : p)
      );
    } catch (err) {
      console.error('Failed to assign patient:', err);
      toast.error('Failed to assign patient');
      throw err;
    }
  };

  // Unassign a patient from the current user
  const unassignPatient = async (patientId: string) => {
    if (!selectedSector || !user) return;
    
    try {
      // Try to unassign in Supabase
      const { error } = await supabase
        .from('provider_patient_assignments')
        .update({ is_active: false, end_date: new Date() })
        .match({ 
          patient_id: patientId,
          provider_id: user.id,
          sector_id: selectedSector.id,
          is_active: true
        });
      
      if (error) {
        console.error('Error unassigning patient:', error);
        throw new Error('Failed to unassign patient');
      }
      
      // Update local state
      setSectorPatients(prev => 
        prev.map(p => p.id === patientId ? { ...p, is_assigned: false } : p)
      );
    } catch (err) {
      console.error('Failed to unassign patient:', err);
      toast.error('Failed to unassign patient');
      throw err;
    }
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
  }, []);

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
