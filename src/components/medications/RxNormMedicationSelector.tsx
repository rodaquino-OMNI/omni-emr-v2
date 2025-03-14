
import React, { useState, useEffect } from 'react';
import { Search, Check, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import {
  searchMedicationsByName,
  RxNormMedication,
  getMedicationDetails,
  mapRxNormToANVISA
} from '@/services/rxnorm/rxnormService';

interface RxNormMedicationSelectorProps {
  onMedicationSelect: (medication: {
    name: string;
    rxnormCode: string;
    anvisaCode: string | null;
    details: any;
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

  useEffect(() => {
    if (initialSearchTerm) {
      handleSearch();
    }
  }, [initialSearchTerm]);

  const handleSearch = async () => {
    if (!searchTerm || searchTerm.length < 3) return;

    setIsSearching(true);
    setSearchResults([]);
    setSelectedMedication(null);
    setMedicationDetails(null);
    
    try {
      const results = await searchMedicationsByName(searchTerm);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast(t('noMedicationsFound'), {
          description: language === 'pt' 
            ? "Tente um termo de pesquisa diferente" 
            : "Try a different search term",
          icon: <AlertCircle className="h-5 w-5 text-amber-500" />
        });
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
      // Get medication details
      const details = await getMedicationDetails(medication.rxcui);
      setMedicationDetails(details);
      
      // Get ANVISA code mapping
      const anvisa = await mapRxNormToANVISA(medication.rxcui);
      setAnvisaCode(anvisa);
      
      // Notify parent component
      onMedicationSelect({
        name: medication.name,
        rxnormCode: medication.rxcui,
        anvisaCode: anvisa,
        details
      });
      
      toast(t('medicationSelected'), {
        description: medication.name,
        icon: <Check className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error('Error getting medication details:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="medication-search">{t('searchRxNorm')}</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              id="medication-search"
              placeholder={t('searchByName')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button 
            onClick={handleSearch}
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

      {searchResults.length > 0 && (
        <div className="rounded-md border border-border">
          <div className="px-4 py-2 bg-muted/50 font-medium border-b border-border text-sm">
            {language === 'pt' ? 'Resultados' : 'Results'} ({searchResults.length})
          </div>
          <div className="max-h-60 overflow-y-auto">
            {searchResults.map((med) => (
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
        </div>
      )}
    </div>
  );
};

export default RxNormMedicationSelector;
