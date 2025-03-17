
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SectorType } from '@/types/sectorTypes';
import { useToast } from '@/components/ui/use-toast';

// Specialized sectors for healthcare
const specializedSectors: SectorType[] = [
  {
    id: 'emergency',
    name: 'Emergency',
    code: 'EMG',
    description: 'Emergency department for urgent care',
    is_active: true
  },
  {
    id: 'icu',
    name: 'ICU',
    code: 'ICU',
    description: 'Intensive Care Unit for critical patients',
    is_active: true
  },
  {
    id: 'cardiology',
    name: 'Cardiology',
    code: 'CAR',
    description: 'Cardiology department for heart disease treatment',
    is_active: true
  },
  {
    id: 'neurology',
    name: 'Neurology',
    code: 'NEU',
    description: 'Neurology department for neurological disorders',
    is_active: true
  },
  {
    id: 'oncology',
    name: 'Oncology',
    code: 'ONC',
    description: 'Oncology department for cancer treatment',
    is_active: true
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    code: 'PED',
    description: 'Pediatrics department for child care',
    is_active: true
  },
  {
    id: 'general',
    name: 'General Ward',
    code: 'GEN',
    description: 'General medical ward for standard inpatient care',
    is_active: true
  },
  {
    id: 'outpatient',
    name: 'Outpatient',
    code: 'OUT',
    description: 'Outpatient clinics and services',
    is_active: true
  }
];

// Function to fetch sectors from the API
const fetchSectors = async (): Promise<SectorType[]> => {
  try {
    // Here we would normally fetch from an API
    // For development, we'll use the specialized sectors
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => resolve(specializedSectors), 800);
    });
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return specializedSectors;
  }
};

export const useCachedSectorData = () => {
  const { toast } = useToast();
  const [isCacheStale, setIsCacheStale] = useState(false);
  
  // Use react-query for caching
  const { 
    data: sectors = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['sectors'],
    queryFn: fetchSectors,
    staleTime: 5 * 60 * 1000, // 5 minutes before data is considered stale
    gcTime: 30 * 60 * 1000, // Cache data for 30 minutes
  });

  // Check if cache should be refreshed
  useEffect(() => {
    const checkCacheStatus = () => {
      const lastFetchTime = localStorage.getItem('lastSectorFetchTime');
      if (lastFetchTime) {
        const timeSinceLastFetch = Date.now() - parseInt(lastFetchTime);
        // If it's been more than 10 minutes, mark the cache as stale
        if (timeSinceLastFetch > 10 * 60 * 1000) {
          setIsCacheStale(true);
        }
      } else {
        // If we've never fetched, mark as stale
        setIsCacheStale(true);
      }
    };

    checkCacheStatus();
    // Set up an interval to check cache staleness
    const interval = setInterval(checkCacheStatus, 5 * 60 * 1000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const fetchSectorsAndUpdateCache = async () => {
    try {
      await refetch();
      localStorage.setItem('lastSectorFetchTime', Date.now().toString());
      setIsCacheStale(false);
      
      toast({
        title: "Sectors Updated",
        description: "The sector data has been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing sectors:', error);
      toast({
        title: "Error Refreshing Sectors",
        description: "Could not refresh sector data. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    sectors,
    isLoading,
    error: error ? 'Failed to load sectors' : null,
    fetchSectors: fetchSectorsAndUpdateCache,
    isCacheStale,
  };
};
