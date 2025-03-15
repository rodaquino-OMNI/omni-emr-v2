
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useMedicationAutocomplete, MedicationSuggestion } from '@/hooks/useMedicationAutocomplete';
import { useTranslation } from '@/hooks/useTranslation';

export interface MedicationAutocompleteProps {
  onSelectMedication: (medication: MedicationSuggestion) => void;
  initialSearchTerm?: string;
  placeholder?: string;
  doctorId?: string;
  patientId?: string;
  diagnosisCode?: string;
  className?: string;
  disabled?: boolean;
}

export const MedicationAutocomplete: React.FC<MedicationAutocompleteProps> = ({
  onSelectMedication,
  initialSearchTerm = '',
  placeholder,
  doctorId,
  patientId,
  diagnosisCode,
  className = '',
  disabled = false
}) => {
  const { t, language } = useTranslation();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  
  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    isLoading,
    error,
    selectedMedication,
    handleSelectMedication
  } = useMedicationAutocomplete({
    doctorId,
    patientId,
    diagnosisCode,
    initialSearchTerm,
    debounceMs: 200
  });
  
  // Handle outside clicks to close the suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // When a medication is selected, pass it to the parent component
  useEffect(() => {
    if (selectedMedication) {
      onSelectMedication(selectedMedication);
    }
  }, [selectedMedication, onSelectMedication]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: MedicationSuggestion) => {
    handleSelectMedication(suggestion);
    setShowSuggestions(false);
  };
  
  // Get appropriate placeholder text based on language
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return language === 'pt' 
      ? 'Digite o nome do medicamento...' 
      : 'Type medication name...';
  };
  
  // Get display name based on language
  const getDisplayName = (suggestion: MedicationSuggestion) => {
    return language === 'pt' && suggestion.name_pt 
      ? suggestion.name_pt 
      : suggestion.name;
  };
  
  return (
    <div className={`relative ${className}`} ref={autocompleteRef}>
      <div className="relative">
        <Input
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className={`pl-9 ${error ? 'border-red-500' : ''}`}
          onFocus={() => {
            if (searchTerm.length >= 2) {
              setShowSuggestions(true);
            }
          }}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        {searchTerm && (
          <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setSearchTerm('');
              setShowSuggestions(false);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {error && (
        <div className="text-sm text-red-500 flex items-center mt-1">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
      
      {showSuggestions && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-input bg-background shadow-md">
          {isLoading ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin inline-block mr-2" />
              {t('loading')}...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1 text-sm">
              {suggestions.map((suggestion) => (
                <li
                  key={`${suggestion.rxcui}-${suggestion.name}`}
                  className="px-3 py-2 hover:bg-muted cursor-pointer flex justify-between items-center"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div>
                    <div>{getDisplayName(suggestion)}</div>
                    {language === 'pt' && suggestion.name_pt && suggestion.name_pt !== suggestion.name && (
                      <div className="text-xs text-muted-foreground">
                        {suggestion.name}
                      </div>
                    )}
                    {suggestion.type && (
                      <Badge variant="outline" className="text-[10px] ml-1">
                        {suggestion.type}
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                    <Check className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : searchTerm.length >= 2 ? (
            <div className="p-2 text-center text-sm text-muted-foreground">
              {language === 'pt' 
                ? 'Nenhum medicamento encontrado' 
                : 'No medications found'}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
