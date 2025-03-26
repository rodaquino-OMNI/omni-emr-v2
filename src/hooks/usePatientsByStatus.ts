import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Patient } from '@/types/patient';
import { supabase } from '@/integrations/supabase/client';
import { PatientStatus } from '@/types/patientTypes';
import { PostgrestError } from '@supabase/supabase-js';

export const usePatientsByStatus = (sectorId?: string) => {
  const fetchPatients = async (): Promise<Patient[]> => {
    try {
      // Execute the query with proper type handling
      let result;
      
      if (sectorId) {
        result = await supabase
          .from('patients')
          .select('*')
          .eq('sector_id', sectorId);
      } else {
        result = await supabase
          .from('patients')
          .select('*');
      }
      
      const { data, error } = result;
      
      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
      
      // Always return an array, even if data is null or undefined
      return (data || []) as Patient[];
    } catch (err) {
      console.error('Error in fetchPatients:', err);
      // Return empty array instead of undefined on error
      return [] as Patient[];
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['patients', sectorId],
    queryFn: fetchPatients
  });

  // Add debug logs for data fetching
  useEffect(() => {
    if (data) {
      console.log('[DEBUG] usePatientsByStatus hook data:', {
        totalPatients: data.length,
        sectorId,
        patientIds: data.map(p => p.id),
        uniquePatientIds: [...new Set(data.map(p => p.id))].length,
        hasDuplicates: data.length !== [...new Set(data.map(p => p.id))].length
      });
    }
  }, [data, sectorId]);

  // Filter patients by status
  // NOTE: These filters are not mutually exclusive - a patient could potentially
  // appear in multiple lists if their status matches multiple criteria.
  // Components using this hook should implement their own deduplication logic
  // if they need to ensure patients only appear in one list, as done in DoctorDashboard.tsx
  const criticalPatients = data?.filter(p =>
    p.status === 'critical' || p.status === 'hospital'
  ) || [];
  
  const stablePatients = data?.filter(p =>
    p.status === 'stable' || p.status === 'improving'
  ) || [];
  
  // Log filtered patients
  useEffect(() => {
    console.log('[DEBUG] Filtered patients:', {
      criticalCount: criticalPatients.length,
      stableCount: stablePatients.length,
      criticalIds: criticalPatients.map(p => p.id),
      stableIds: stablePatients.map(p => p.id),
      // Check for patients that appear in both lists
      patientsInBothLists: criticalPatients
        .filter(cp => stablePatients.some(sp => sp.id === cp.id))
        .map(p => p.id)
    });
  }, [criticalPatients, stablePatients]);

  return {
    data,
    criticalPatients,
    stablePatients,
    loading: isLoading,
    error
  };
};

// Utility function to filter patients by status
export const filterPatientsByStatus = (patients: Patient[], status: PatientStatus | PatientStatus[]): Patient[] => {
  if (!patients) return [];
  
  // If status is an array, filter patients whose status is in the array
  if (Array.isArray(status)) {
    return patients.filter(patient => status.includes(patient.status));
  }
  
  // Otherwise, filter patients with the matching status
  return patients.filter(patient => patient.status === status);
};
