
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SectorType } from '@/types/sectorTypes';

export const useSectorData = () => {
  const [sectors, setSectors] = useState<SectorType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock sectors as fallback
  const mockSectors: SectorType[] = [
    { id: 'emergency', name: 'Emergency', code: 'EMG', is_active: true, description: 'Emergency care unit' },
    { id: 'icu', name: 'ICU', code: 'ICU', is_active: true, description: 'Critical care unit' },
    { id: 'general', name: 'General Medical', code: 'GEN', is_active: true, description: 'General medical ward' },
    { id: 'outpatient', name: 'Outpatient', code: 'OUT', is_active: true, description: 'Outpatient services' },
    { id: 'homecare', name: 'Home Care', code: 'HMC', is_active: true, description: 'Home care services' },
  ];

  // Fetch sectors from Supabase
  const fetchSectors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
        { id: 'emergency', name: 'Emergency', code: 'EMG', is_active: true, description: 'Emergency care unit' },
        { id: 'icu', name: 'ICU', code: 'ICU', is_active: true, description: 'Critical care unit' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sectors,
    isLoading,
    error,
    fetchSectors
  };
};
