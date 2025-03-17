import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Patient } from '@/types/patientTypes';

export const usePatients = (initialFilters = {}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      
      const query = supabase.from('patients').select('*');
      
      // Apply filters
      // Implement filter logic based on the fields in the filters object
      
      try {
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setPatients(data || []);
      } catch (err: any) {
        console.error('Error fetching patients:', err);
        setError(err?.message || 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, [filters]);
  
  const updateFilters = (newFilters: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  return { patients, loading, error, updateFilters, filters };
};
