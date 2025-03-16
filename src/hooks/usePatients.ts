import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Patient } from '@/types/patientTypes';

// Fetch all patients
export const usePatients = (sectorId?: string) => {
  return useQuery({
    queryKey: ['patients', sectorId],
    queryFn: async () => {
      let query = supabase
        .from('patients')
        .select('*');
        
      if (sectorId) {
        // If a sector ID is provided, filter patients by sector
        const { data, error } = await supabase
          .rpc('get_sector_patients', { p_sector_id: sectorId });
          
        if (error) throw error;
        return data as Patient[];
      } else {
        // Otherwise, fetch all patients
        const { data, error } = await query;
        if (error) throw error;
        return data as Patient[];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

// Fetch a single patient by ID
export const usePatient = (patientId?: string) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) throw new Error('Patient ID is required');
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
        
      if (error) throw error;
      return data as Patient;
    },
    enabled: !!patientId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create a new patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newPatient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('patients')
        .insert([newPatient])
        .select()
        .single();
        
      if (error) throw error;
      return data as Patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Patient created successfully');
    },
    onError: (error) => {
      console.error('Error creating patient:', error);
      toast.error('Failed to create patient');
    },
  });
};

// Update an existing patient
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedPatient: Partial<Patient> & { id: string }) => {
      const { data, error } = await supabase
        .from('patients')
        .update(updatedPatient)
        .eq('id', updatedPatient.id)
        .select()
        .single();
        
      if (error) throw error;
      return data as Patient;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', data.id] });
      toast.success('Patient updated successfully');
    },
    onError: (error) => {
      console.error('Error updating patient:', error);
      toast.error('Failed to update patient');
    },
  });
};

// Delete a patient (rarely used in healthcare systems, might be archived instead)
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patientId: string) => {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientId);
        
      if (error) throw error;
      return patientId;
    },
    onSuccess: (patientId) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.setQueryData(['patient', patientId], null);
      toast.success('Patient removed successfully');
    },
    onError: (error) => {
      console.error('Error deleting patient:', error);
      toast.error('Failed to remove patient');
    },
  });
};
