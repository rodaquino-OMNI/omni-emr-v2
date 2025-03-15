
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { useTranslation } from './useTranslation';
import { searchMedicationsByBilingualName, getPortugueseMedicationName } from '@/services/rxnorm/rxnormLanguageMapping';
import { searchMedicationsByName, getSpellingSuggestions } from '@/services/rxnorm/rxnormSearch';

// Interface for medication suggestions
export interface MedicationSuggestion {
  rxcui: string;
  name: string;
  name_pt?: string;
  strength?: string;
  form?: string;
  type?: string;
  popularity?: number;
}

interface UseMedicationAutocompleteProps {
  doctorId?: string;
  patientId?: string;
  diagnosisCode?: string;
  initialSearchTerm?: string;
  debounceMs?: number;
  maxResults?: number;
}

export function useMedicationAutocomplete({
  doctorId,
  patientId,
  diagnosisCode,
  initialSearchTerm = '',
  debounceMs = 200,
  maxResults = 10
}: UseMedicationAutocompleteProps = {}) {
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [suggestions, setSuggestions] = useState<MedicationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMedication, setSelectedMedication] = useState<MedicationSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Local cache for quick access to recent searches
  const [localCache, setLocalCache] = useState<{[key: string]: MedicationSuggestion[]}>({});
  
  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);
  
  // Load suggestions from localStorage on mount
  useEffect(() => {
    try {
      const cachedSuggestions = localStorage.getItem('recentMedicationSuggestions');
      if (cachedSuggestions) {
        setLocalCache(JSON.parse(cachedSuggestions));
      }
    } catch (error) {
      console.error('Error loading cached suggestions:', error);
    }
  }, []);
  
  // Save suggestions to localStorage when they change
  useEffect(() => {
    if (Object.keys(localCache).length > 0) {
      try {
        // Only store most recent 50 searches to avoid localStorage limits
        const cacheEntries = Object.entries(localCache);
        if (cacheEntries.length > 50) {
          const trimmedCache = Object.fromEntries(cacheEntries.slice(-50));
          localStorage.setItem('recentMedicationSuggestions', JSON.stringify(trimmedCache));
        } else {
          localStorage.setItem('recentMedicationSuggestions', JSON.stringify(localCache));
        }
      } catch (error) {
        console.error('Error saving cached suggestions:', error);
      }
    }
  }, [localCache]);
  
  // Fetch suggestions based on the debounced search term
  const fetchSuggestions = useCallback(async () => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    
    // Check local cache first for instant results
    const cacheKey = `${debouncedSearchTerm.toLowerCase()}_${language}`;
    if (localCache[cacheKey]) {
      console.log('Using cached suggestions for:', debouncedSearchTerm);
      setSuggestions(localCache[cacheKey]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Choose search strategy based on language
      let medicationResults;
      if (language === 'pt') {
        medicationResults = await searchMedicationsByBilingualName(debouncedSearchTerm);
      } else {
        medicationResults = await searchMedicationsByName(debouncedSearchTerm);
      }
      
      // Transform results to MedicationSuggestion format
      const transformedResults: MedicationSuggestion[] = await Promise.all(
        medicationResults.slice(0, maxResults).map(async (med: any) => {
          let name_pt = 'portugueseName' in med ? med.portugueseName : null;
          
          // If no Portuguese name is available, try to fetch it
          if (!name_pt && language === 'pt') {
            name_pt = await getPortugueseMedicationName(med.rxcui);
          }
          
          return {
            rxcui: med.rxcui,
            name: med.name,
            name_pt: name_pt || undefined,
            type: med.tty || undefined,
            // You'd typically get these from detailed RxNorm data
            strength: undefined,
            form: undefined,
            // Could be based on prescribing history if available
            popularity: undefined
          };
        })
      );
      
      // Update local cache with new results
      setLocalCache(prev => ({
        ...prev,
        [cacheKey]: transformedResults
      }));
      
      setSuggestions(transformedResults);
    } catch (error) {
      console.error('Error fetching medication suggestions:', error);
      setError('Failed to fetch suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, language, localCache, maxResults]);
  
  // Fetch suggestions when the debounced search term changes
  useEffect(() => {
    fetchSuggestions();
  }, [debouncedSearchTerm, fetchSuggestions]);
  
  // Handler to select a medication
  const handleSelectMedication = useCallback((med: MedicationSuggestion) => {
    setSelectedMedication(med);
    setSearchTerm(language === 'pt' && med.name_pt ? med.name_pt : med.name);
    setSuggestions([]);
    
    // Track this selection to improve future suggestions
    // This would typically update a "popularity" score on the server
    console.log('Selected medication:', med);
  }, [language]);
  
  return {
    searchTerm,
    setSearchTerm,
    suggestions,
    isLoading,
    error,
    selectedMedication,
    handleSelectMedication,
    refreshSuggestions: fetchSuggestions
  };
}
