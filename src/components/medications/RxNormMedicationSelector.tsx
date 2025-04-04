import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, AlertCircle, RefreshCw, Database, X, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { debounce } from 'lodash';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import {
  searchMedicationsByName,
  getSpellingSuggestions
} from '@/services/rxnorm/rxnormSearch';
import {
  getMedicationDetails,
  getNDCsByRxCUI
} from '@/services/rxnorm/rxnormDetails';
import { 
  searchMedicationsByBilingualName,
  getPortugueseMedicationName,
  getBilingualMedicationSuggestions
} from '@/services/rxnorm/rxnormLanguageMapping';
import { RxNormMedication, RxNormDisplayTerm, RxNormNDC } from '@/types/rxnorm';
import { mapRxNormToANVISA } from '@/services/rxnorm/rxnormMappings';

interface RxNormMedicationSelectorProps {
  onMedicationSelect: (medication: {
    name: string;
    rxnormCode: string;
    anvisaCode: string | null;
    details: any;
    ndcs?: RxNormNDC[];
    portugueseName?: string | null;
  }) => void;
  initialSearchTerm?: string;
}

const RxNormMedicationSelector: React.FC<RxNormMedicationSelectorProps> = ({
  onMedicationSelect,
  initialSearchTerm = ''
}) => {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<RxNormMedication[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<RxNormMedication | null>(null);
  const [medicationDetails, setMedicationDetails] = useState<any | null>(null);
  const [anvisaCode, setAnvisaCode] = useState<string | null>(null);
  const [portugueseName, setPortugueseName] = useState<string | null>(null);
  const [autocompleteResults, setAutocompleteResults] = useState<RxNormDisplayTerm[]>([]);
  const [ndcCodes, setNdcCodes] = useState<RxNormNDC[]>([]);
  const [spellingSuggestions, setSpellingSuggestions] = useState<string[]>([]);
  const [portugueseSuggestions, setPortugueseSuggestions] = useState<string[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [searchMode, setSearchMode] = useState<'both' | 'english' | 'portuguese'>('both');
  
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSearchTerm) {
      handleSearch(initialSearchTerm);
    }
    
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [initialSearchTerm]);
  
  const debouncedAutocomplete = useRef(
    debounce(async (term: string) => {
      if (term.length < 2) {
        setAutocompleteResults([]);
        setShowAutocomplete(false);
        return;
      }
      
      try {
        console.log('Calling getDisplayTerms for term:', term);
        setIsSearching(true);
        
        // Get suggestions in both languages
        const { getDisplayTerms } = await import('@/services/rxnorm/rxnormSearch');
        const results = await getDisplayTerms(term, 10);
        setAutocompleteResults(results);
        
        // Also get Portuguese suggestions
        if (language === 'pt' || searchMode !== 'english') {
          const { englishSuggestions, portugueseSuggestions } = 
            await getBilingualMedicationSuggestions(term);
          setPortugueseSuggestions(portugueseSuggestions);
        }
        
        setShowAutocomplete(results.length > 0 || portugueseSuggestions.length > 0);
      } catch (error) {
        console.error('Error fetching autocomplete results:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300)
  ).current;
  
  useEffect(() => {
    return () => {
      debouncedAutocomplete.cancel();
    };
  }, [debouncedAutocomplete]);
  
  useEffect(() => {
    debouncedAutocomplete(searchTerm);
  }, [searchTerm, debouncedAutocomplete]);

  const handleSearch = async (searchQuery?: string) => {
    const query = searchQuery || searchTerm;
    if (!query || query.trim().length < 3) return;

    setIsSearching(true);
    setSearchResults([]);
    setSelectedMedication(null);
    setMedicationDetails(null);
    setNdcCodes([]);
    setShowAutocomplete(false);
    
    try {
      let results: RxNormMedication[] = [];
      
      // Use different search strategies based on mode
      if (searchMode === 'both') {
        results = await searchMedicationsByBilingualName(query);
      } else if (searchMode === 'english') {
        results = await searchMedicationsByName(query);
      } else if (searchMode === 'portuguese') {
        results = await searchMedicationsByBilingualName(query);
        // Filter to just show those with Portuguese names
        results = results.filter(med => 'portugueseName' in med);
      }
      
      setSearchResults(results);
      
      if (results.length === 0) {
        // Get suggestions in both languages
        const { englishSuggestions, portugueseSuggestions } = 
          await getBilingualMedicationSuggestions(query);
        
        setSpellingSuggestions(englishSuggestions);
        setPortugueseSuggestions(portugueseSuggestions);
        
        toast(t('noMedicationsFound'), {
          description: language === 'pt' 
            ? "Tente um termo de pesquisa diferente" 
            : "Try a different search term",
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />
        });
      } else {
        setSpellingSuggestions([]);
        setPortugueseSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching for medications:', error);
      toast(t('featureNotImplemented'), {
        description: language === 'pt'
          ? "Não foi possível conectar ao serviço RxNorm"
          : "Couldn't connect to RxNorm service",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectMedication = async (medication: RxNormMedication) => {
    setSelectedMedication(medication);
    
    try {
      const details = await getMedicationDetails(medication.rxcui);
      setMedicationDetails(details);
      
      const anvisa = await mapRxNormToANVISA(medication.rxcui);
      setAnvisaCode(anvisa);
      
      const ndcs = await getNDCsByRxCUI(medication.rxcui);
      setNdcCodes(ndcs);
      
      // Get Portuguese name
      let ptName = 'portugueseName' in medication ? 
        (medication as any).portugueseName : null;
      
      if (!ptName) {
        ptName = await getPortugueseMedicationName(medication.rxcui);
        setPortugueseName(ptName);
      } else {
        setPortugueseName(ptName);
      }
      
      onMedicationSelect({
        name: medication.name,
        rxnormCode: medication.rxcui,
        anvisaCode: anvisa,
        details,
        ndcs,
        portugueseName: ptName
      });
      
      toast(t('medicationSelected'), {
        description: language === 'pt' && ptName ? ptName : medication.name,
        icon: <Check className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error('Error getting medication details:', error);
    }
  };
  
  const handleAutocompleteSelect = (term: RxNormDisplayTerm) => {
    console.log('Selected term:', term);
    setSearchTerm(term.name);
    setShowAutocomplete(false);
    
    const medicationToSelect = {
      rxcui: term.rxcui,
      name: term.name,
      tty: term.tty
    };
    handleSelectMedication(medicationToSelect);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setTimeout(() => handleSearch(suggestion), 100);
  };

  const toggleSearchMode = (mode: 'both' | 'english' | 'portuguese') => {
    setSearchMode(mode);
    // Re-trigger search if there's a search term
    if (searchTerm.length >= 3) {
      setTimeout(() => handleSearch(searchTerm), 100);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="medication-search">{t('searchRxNorm')}</Label>
          
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div className="flex rounded-md border border-input p-0.5 bg-muted/40">
              <Button 
                variant="ghost" 
                size="sm"
                className={`px-2 py-1 ${searchMode === 'both' ? 'bg-background' : ''}`}
                onClick={() => toggleSearchMode('both')}
              >
                {language === 'pt' ? 'Ambos' : 'Both'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`px-2 py-1 ${searchMode === 'english' ? 'bg-background' : ''}`}
                onClick={() => toggleSearchMode('english')}
              >
                {language === 'pt' ? 'Inglês' : 'English'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`px-2 py-1 ${searchMode === 'portuguese' ? 'bg-background' : ''}`}
                onClick={() => toggleSearchMode('portuguese')}
              >
                {language === 'pt' ? 'Português' : 'Portuguese'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              id="medication-search"
              placeholder={
                searchMode === 'english' 
                  ? t('searchByName') 
                  : searchMode === 'portuguese'
                    ? (language === 'pt' ? 'Pesquisar por nome em português' : 'Search by Portuguese name')
                    : (language === 'pt' ? 'Pesquisar em ambos idiomas' : 'Search in both languages')
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              onFocus={() => {
                if (searchTerm.length >= 2 && (autocompleteResults.length > 0 || portugueseSuggestions.length > 0)) {
                  setShowAutocomplete(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            {searchTerm && (
              <button 
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSearchTerm('');
                  setAutocompleteResults([]);
                  setShowAutocomplete(false);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {searchTerm.length >= 2 && (
              <>
                {isSearching && (
                  <div className="absolute right-10 top-2.5">
                    <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
                
                {showAutocomplete && (
                  <div 
                    ref={autocompleteRef}
                    className="absolute z-10 mt-1 w-full rounded-md border border-border bg-background shadow-lg"
                  >
                    <Tabs defaultValue="english" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="english">
                          {language === 'pt' ? 'Inglês' : 'English'}
                        </TabsTrigger>
                        <TabsTrigger value="portuguese">
                          {language === 'pt' ? 'Português' : 'Portuguese'}
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="english" className="max-h-60 overflow-y-auto">
                        {autocompleteResults.length > 0 ? (
                          <ul className="py-1 text-sm">
                            {autocompleteResults.map((term) => (
                              <li
                                key={`${term.rxcui}-${term.name}`}
                                className="px-3 py-2 hover:bg-accent cursor-pointer"
                                onClick={() => handleAutocompleteSelect(term)}
                              >
                                {term.name}
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({term.tty})
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : !isSearching && (
                          <div className="p-2 text-sm text-muted-foreground">
                            {language === 'pt' ? 'Nenhum resultado encontrado' : 'No results found'}
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="portuguese" className="max-h-60 overflow-y-auto">
                        {portugueseSuggestions.length > 0 ? (
                          <ul className="py-1 text-sm">
                            {portugueseSuggestions.map((term, index) => (
                              <li
                                key={`pt-${index}-${term}`}
                                className="px-3 py-2 hover:bg-accent cursor-pointer"
                                onClick={() => handleSuggestionClick(term)}
                              >
                                {term}
                                <Badge variant="outline" className="ml-2 text-[10px]">PT</Badge>
                              </li>
                            ))}
                          </ul>
                        ) : !isSearching && (
                          <div className="p-2 text-sm text-muted-foreground">
                            {language === 'pt' ? 'Nenhum resultado encontrado' : 'No results found'}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </>
            )}
          </div>
          <Button 
            onClick={handleButtonClick}
            disabled={isSearching || searchTerm.length < 3}
            size="sm"
          >
            {isSearching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4 mr-1" />
            )}
            {t('searchRxNorm')}
          </Button>
        </div>
      </div>

      {spellingSuggestions.length > 0 && (
        <div className="text-sm">
          <p className="mb-1 text-muted-foreground">
            {language === 'pt' ? 'Você quis dizer:' : 'Did you mean:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {spellingSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="px-2 py-1 rounded bg-accent hover:bg-accent/80 text-accent-foreground text-xs"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {portugueseSuggestions.length > 0 && (
        <div className="text-sm">
          <p className="mb-1 text-muted-foreground">
            {language === 'pt' ? 'Sugestões em português:' : 'Portuguese suggestions:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {portugueseSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="px-2 py-1 rounded bg-accent hover:bg-accent/80 text-accent-foreground text-xs"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="rounded-md border border-border">
          <div className="px-4 py-2 bg-muted/50 font-medium border-b border-border text-sm">
            {language === 'pt' ? 'Resultados' : 'Results'} ({searchResults.length})
          </div>
          <div className="max-h-60 overflow-y-auto">
            {searchResults.map((med: any) => (
              <div
                key={med.rxcui}
                className={`px-4 py-2 border-b border-border last:border-0 hover:bg-muted cursor-pointer transition-colors ${
                  selectedMedication?.rxcui === med.rxcui ? 'bg-primary/10' : ''
                }`}
                onClick={() => handleSelectMedication(med)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{med.name}</div>
                    {med.portugueseName && (
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Badge variant="outline" className="mr-1 text-[10px]">PT</Badge>
                        {med.portugueseName}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {t('rxnormCode')}: {med.rxcui}
                    </div>
                  </div>
                  {selectedMedication?.rxcui === med.rxcui && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMedication && medicationDetails && (
        <div className="rounded-md border border-border p-4 space-y-3">
          <div className="font-medium text-lg">{selectedMedication.name}</div>
          
          {portugueseName && (
            <div className="flex items-center text-sm bg-muted p-2 rounded">
              <Badge className="mr-2">{language === 'pt' ? 'Nome em Português' : 'Portuguese Name'}</Badge>
              <span>{portugueseName}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">{t('rxnormCode')}</Label>
              <div>{selectedMedication.rxcui}</div>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">{t('anvisaCode')}</Label>
              <div>{anvisaCode || (language === 'pt' ? 'Não mapeado' : 'Not mapped')}</div>
            </div>
            
            {medicationDetails.ingredients?.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">{t('ingredientStrength')}</Label>
                <div>{medicationDetails.ingredients.map((ing: any) => ing.name).join(', ')}</div>
                {portugueseName && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {language === 'pt' ? 'Verifique no ANVISA' : 'Verify in ANVISA'}
                  </div>
                )}
              </div>
            )}
            
            {medicationDetails.dosageForms?.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">{t('dosageForm')}</Label>
                <div>{medicationDetails.dosageForms[0]?.name}</div>
              </div>
            )}
            
            {medicationDetails.brandNames?.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">{t('brandName')}</Label>
                <div>{medicationDetails.brandNames.map((bn: any) => bn.name).join(', ')}</div>
              </div>
            )}
          </div>
          
          {ndcCodes.length > 0 && (
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground mb-1 block">
                {language === 'pt' ? 'Códigos NDC' : 'NDC Codes'}
              </Label>
              <div className="bg-muted p-2 rounded text-sm max-h-20 overflow-y-auto">
                <div className="grid grid-cols-2 gap-2">
                  {ndcCodes.map((ndc, index) => (
                    <div key={`${ndc.ndc}-${index}`} className="text-xs">
                      {ndc.ndc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RxNormMedicationSelector;
