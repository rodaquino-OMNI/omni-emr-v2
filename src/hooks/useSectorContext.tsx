import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sector, SectorPatient } from '@/types/sector';
import { toast } from 'sonner';

interface SectorContextType {
  sectors: Sector[];
  sectorPatients: SectorPatient[];
  selectedSector: Sector | null;
  loading: boolean;
  patientsLoading: boolean;
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
    const saved = localStorage.getItem('omnicare-selected-sector');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [patientsLoading, setPatientsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    refreshSectors();
  }, []);

  useEffect(() => {
    if (selectedSector) {
      refreshPatients();
    } else {
      setSectorPatients([]);
    }
  }, [selectedSector]);

  const refreshSectors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_user_sectors');
      
      if (error) {
        console.error("Error calling get_user_sectors RPC:", error);
        const fallbackResult = await supabase
          .from('hospital_sectors')
          .select('*')
          .eq('is_active', true)
          .order('name');
          
        if (fallbackResult.error) throw fallbackResult.error;
        setSectors(fallbackResult.data || []);
      } else {
        setSectors(data || []);
      }
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch sectors'));
      toast.error('Failed to load sectors');
    } finally {
      setLoading(false);
    }
  };

  const refreshPatients = async () => {
    if (!selectedSector) return;
    
    try {
      setPatientsLoading(true);
      
      const { data, error } = await supabase.rpc('get_sector_patients', {
        p_sector_id: selectedSector.id
      });
      
      if (error) {
        console.error("Error calling get_sector_patients RPC:", error);
        const fallbackResult = await supabase
          .from('patients')
          .select(`
            id, 
            first_name, 
            last_name, 
            date_of_birth, 
            gender,
            mrn,
            room_number,
            status
          `)
          .eq('is_active', true)
          .order('last_name');
          
        if (fallbackResult.error) throw fallbackResult.error;
        
        const formattedData = fallbackResult.data.map(p => ({
          ...p,
          is_assigned: false
        }));
          
        setSectorPatients(formattedData || []);
      } else {
        setSectorPatients(data || []);
      }
    } catch (err) {
      console.error('Error fetching sector patients:', err);
      toast.error('Failed to load patients');
    } finally {
      setPatientsLoading(false);
    }
  };

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
      patientsLoading,
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
