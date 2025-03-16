
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SectorPatient } from '@/types/sectorTypes';

export const useSectorPatients = (
  selectedSector: { id: string } | null, 
  userId: string | undefined
) => {
  const [sectorPatients, setSectorPatients] = useState<SectorPatient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState<boolean>(false);

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

  // Assign a patient to the current user in the selected sector
  const assignPatient = async (patientId: string) => {
    if (!selectedSector || !userId) return;
    
    try {
      // Try to assign in Supabase
      const { error } = await supabase
        .from('provider_patient_assignments')
        .insert([
          {
            patient_id: patientId,
            provider_id: userId,
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
    if (!selectedSector || !userId) return;
    
    try {
      // Try to unassign in Supabase
      const { error } = await supabase
        .from('provider_patient_assignments')
        .update({ is_active: false, end_date: new Date() })
        .match({ 
          patient_id: patientId,
          provider_id: userId,
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

  return {
    sectorPatients,
    patientsLoading,
    fetchPatients,
    refreshPatients,
    assignPatient,
    unassignPatient
  };
};
