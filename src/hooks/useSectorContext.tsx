
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sector, SectorPatient } from '@/types/sector';
import { toast } from 'sonner';

interface SectorContextType {
  sectors: Sector[];
  sectorPatients: SectorPatient[];
  selectedSector: Sector | null;
  loading: boolean;
  error: Error | null;
  selectSector: (sector: Sector) => void;
  refreshSectors: () => Promise<void>;
  refreshPatients: () => Promise<void>;
  assignPatient: (patientId: string) => Promise<void>;
  unassignPatient: (patientId: string) => Promise<void>;
}

const SectorContext = createContext<SectorContextType | undefined>(undefined);

export const SectorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [sectorPatients, setSectorPatients] = useState<SectorPatient[]>([]);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(() => {
    // Try to load from localStorage on init
    const saved = localStorage.getItem('omnicare-selected-sector');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch sectors on mount
  useEffect(() => {
    refreshSectors();
  }, []);

  // Fetch patients when selected sector changes
  useEffect(() => {
    if (selectedSector) {
      refreshPatients();
    } else {
      setSectorPatients([]);
    }
  }, [selectedSector]);

  // Fetch all sectors user has access to
  const refreshSectors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_user_sectors');
      
      if (error) throw error;
      
      setSectors(data || []);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch sectors'));
      toast.error('Failed to load sectors');
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients for the selected sector
  const refreshPatients = async () => {
    if (!selectedSector) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.rpc('get_sector_patients', {
        p_sector_id: selectedSector.id
      });
      
      if (error) throw error;
      
      setSectorPatients(data || []);
    } catch (err) {
      console.error('Error fetching sector patients:', err);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  // Assign a patient to the current provider
  const assignPatient = async (patientId: string) => {
    if (!selectedSector) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('provider_patient_assignments')
        .insert({
          provider_id: (await supabase.auth.getUser()).data.user?.id,
          patient_id: patientId,
          sector_id: selectedSector.id,
          is_active: true
        });
      
      if (error) throw error;
      
      // Update local state to show assignment
      setSectorPatients(prev => 
        prev.map(patient => 
          patient.id === patientId 
            ? { ...patient, is_assigned: true } 
            : patient
        )
      );
      
      toast.success('Patient assigned successfully');
    } catch (err) {
      console.error('Error assigning patient:', err);
      toast.error('Failed to assign patient');
    } finally {
      setLoading(false);
    }
  };

  // Unassign a patient from the current provider
  const unassignPatient = async (patientId: string) => {
    if (!selectedSector) return;
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('provider_patient_assignments')
        .update({ 
          is_active: false,
          end_date: new Date().toISOString()
        })
        .match({ 
          provider_id: (await supabase.auth.getUser()).data.user?.id,
          patient_id: patientId,
          sector_id: selectedSector.id,
          is_active: true
        });
      
      if (error) throw error;
      
      // Update local state to show unassignment
      setSectorPatients(prev => 
        prev.map(patient => 
          patient.id === patientId 
            ? { ...patient, is_assigned: false } 
            : patient
        )
      );
      
      toast.success('Patient unassigned successfully');
    } catch (err) {
      console.error('Error unassigning patient:', err);
      toast.error('Failed to unassign patient');
    } finally {
      setLoading(false);
    }
  };

  // Select a sector and save to localStorage
  const selectSector = (sector: Sector) => {
    setSelectedSector(sector);
    localStorage.setItem('omnicare-selected-sector', JSON.stringify(sector));
  };

  return (
    <SectorContext.Provider value={{
      sectors,
      sectorPatients,
      selectedSector,
      loading,
      error,
      selectSector,
      refreshSectors,
      refreshPatients,
      assignPatient,
      unassignPatient
    }}>
      {children}
    </SectorContext.Provider>
  );
};

export const useSectorContext = () => {
  const context = useContext(SectorContext);
  if (context === undefined) {
    throw new Error('useSectorContext must be used within a SectorProvider');
  }
  return context;
};
