
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sector, SectorPatient } from '@/types/sector';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SectorContextType {
  sectors: Sector[];
  loading: boolean;
  selectedSector: Sector | null;
  selectSector: (sector: Sector) => void;
  sectorPatients: SectorPatient[];
  patientsLoading: boolean;
  refreshPatients: () => Promise<void>;
  assignPatient: (patientId: string) => Promise<void>;
  unassignPatient: (patientId: string) => Promise<void>;
}

const SectorContext = createContext<SectorContextType | undefined>(undefined);

export const SectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [sectorPatients, setSectorPatients] = useState<SectorPatient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  // Fetch sectors when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchSectors();
    }
  }, [isAuthenticated]);

  // Fetch patients when a sector is selected
  useEffect(() => {
    if (selectedSector) {
      fetchPatients();
    } else {
      setSectorPatients([]);
    }
  }, [selectedSector]);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_sectors');
      
      if (error) {
        throw error;
      }
      
      setSectors(data || []);
    } catch (error) {
      console.error('Error fetching sectors:', error);
      toast.error('Failed to load hospital sectors');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    if (!selectedSector) return;
    
    try {
      setPatientsLoading(true);
      const { data, error } = await supabase.rpc('get_sector_patients', {
        p_sector_id: selectedSector.id
      });
      
      if (error) {
        throw error;
      }
      
      setSectorPatients(data || []);
    } catch (error) {
      console.error('Error fetching sector patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setPatientsLoading(false);
    }
  };

  const selectSector = (sector: Sector) => {
    setSelectedSector(sector);
  };

  const refreshPatients = async () => {
    await fetchPatients();
  };

  const assignPatient = async (patientId: string) => {
    if (!selectedSector) return;
    
    try {
      const { error } = await supabase
        .from('provider_patient_assignments')
        .insert({
          patient_id: patientId,
          sector_id: selectedSector.id,
          is_active: true
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Patient assigned successfully');
      await refreshPatients();
    } catch (error) {
      console.error('Error assigning patient:', error);
      toast.error('Failed to assign patient');
    }
  };

  const unassignPatient = async (patientId: string) => {
    if (!selectedSector) return;
    
    try {
      const { error } = await supabase
        .from('provider_patient_assignments')
        .update({
          is_active: false,
          end_date: new Date().toISOString()
        })
        .match({
          patient_id: patientId,
          sector_id: selectedSector.id,
          is_active: true,
          end_date: null
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Patient unassigned successfully');
      await refreshPatients();
    } catch (error) {
      console.error('Error unassigning patient:', error);
      toast.error('Failed to unassign patient');
    }
  };

  return (
    <SectorContext.Provider
      value={{
        sectors,
        loading,
        selectedSector,
        selectSector,
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

export const useSectorContext = () => {
  const context = useContext(SectorContext);
  if (context === undefined) {
    throw new Error('useSectorContext must be used within a SectorProvider');
  }
  return context;
};
