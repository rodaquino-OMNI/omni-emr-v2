
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SectorType } from '@/types/sectorTypes';

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

interface CachedData<T> {
  data: T;
  timestamp: number;
}

interface UseCachedSectorDataReturn {
  sectors: SectorType[];
  isLoading: boolean;
  error: string | null;
  refreshSectors: () => Promise<void>;
  isCacheStale: boolean;
}

export const useCachedSectorData = (): UseCachedSectorDataReturn => {
  const [sectors, setSectors] = useState<SectorType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheTimestamp, setCacheTimestamp] = useState<number>(0);

  // Mock sectors as fallback
  const mockSectors: SectorType[] = [
    { id: 'emergency', name: 'Emergency', code: 'EMG', is_active: true, description: 'Emergency care unit' },
    { id: 'icu', name: 'ICU', code: 'ICU', is_active: true, description: 'Critical care unit' },
    { id: 'general', name: 'General Medical', code: 'GEN', is_active: true, description: 'General medical ward' },
    { id: 'outpatient', name: 'Outpatient', code: 'OUT', is_active: true, description: 'Outpatient services' },
    { id: 'homecare', name: 'Home Care', code: 'HMC', is_active: true, description: 'Home care services' },
  ];

  // Check if cache is stale
  const isCacheStale = Date.now() - cacheTimestamp > CACHE_EXPIRATION;

  // Load data from cache
  const loadFromCache = useCallback(() => {
    try {
      const cachedSectors = localStorage.getItem('sectorCache');
      if (cachedSectors) {
        const { data, timestamp }: CachedData<SectorType[]> = JSON.parse(cachedSectors);
        
        // If cached data is valid and not expired
        if (data && data.length > 0 && Date.now() - timestamp < CACHE_EXPIRATION) {
          setSectors(data);
          setCacheTimestamp(timestamp);
          setIsLoading(false);
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error('Error loading from cache:', e);
      return false;
    }
  }, []);

  // Save data to cache
  const saveToCache = useCallback((data: SectorType[]) => {
    try {
      const timestamp = Date.now();
      localStorage.setItem('sectorCache', JSON.stringify({ data, timestamp }));
      setCacheTimestamp(timestamp);
    } catch (e) {
      console.error('Error saving to cache:', e);
    }
  }, []);

  // Fetch sectors from Supabase
  const fetchSectors = useCallback(async (skipCache = false) => {
    try {
      setError(null);
      
      // Try to load from cache first, if not skipping cache
      if (!skipCache && loadFromCache()) {
        return;
      }
      
      setIsLoading(true);
      
      // Try to fetch from Supabase if connected
      const { data, error } = await supabase
        .from('hospital_sectors')
        .select('*')
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching sectors:', error);
        // Fall back to mock data if there's an error
        setSectors(mockSectors);
        saveToCache(mockSectors);
      } else if (data && data.length > 0) {
        setSectors(data);
        saveToCache(data);
      } else {
        // If no data from Supabase, use mock data
        setSectors(mockSectors);
        saveToCache(mockSectors);
      }
    } catch (err) {
      console.error('Failed to fetch sectors:', err);
      setError('Failed to load sectors. Please try again later.');
      // Fall back to mock data
      setSectors(mockSectors);
      saveToCache(mockSectors);
    } finally {
      setIsLoading(false);
    }
  }, [loadFromCache, saveToCache]);

  // Force refresh the sectors data
  const refreshSectors = useCallback(async () => {
    await fetchSectors(true); // Skip cache when manually refreshing
  }, [fetchSectors]);

  // Initial fetch on mount
  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  // Auto-refresh when cache becomes stale and component is visible
  useEffect(() => {
    if (isCacheStale && document.visibilityState === 'visible') {
      fetchSectors();
    }
  }, [isCacheStale, fetchSectors]);

  // Listen for visibility changes to refresh data when the app becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isCacheStale) {
        fetchSectors();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isCacheStale, fetchSectors]);

  return {
    sectors,
    isLoading,
    error,
    refreshSectors,
    isCacheStale
  };
};
