
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Loader2, Database } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMedicationsByName } from "@/services/rxnorm/rxnormSearch";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DrugInteractionSearchProps {
  onAddMedication: (medication: { rxcui: string; name: string }) => void;
}

const DrugInteractionSearch: React.FC<DrugInteractionSearchProps> = ({ onAddMedication }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ rxcui: string; name: string }>>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Clear search results when input is cleared
  useEffect(() => {
    if (searchTerm === '') {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // Search for medications when debounced search term changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchMedicationsByName(debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching medications:", error);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Type medication name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pr-8"
        />
        {isSearching ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border rounded-md overflow-hidden shadow-sm">
          <ScrollArea className="max-h-64">
            <ul className="divide-y">
              {searchResults.map((med) => (
                <li 
                  key={med.rxcui} 
                  className="p-3 hover:bg-muted/50 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{med.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Database className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">RxCUI: {med.rxcui}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      onAddMedication(med);
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    className="gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}

      {!isSearching && debouncedSearchTerm.trim().length >= 2 && searchResults.length === 0 && (
        <div className="text-center p-4 text-muted-foreground bg-muted/30 rounded-md">
          <p>No medications found for "{debouncedSearchTerm}"</p>
          <p className="text-xs mt-1">Try a different medication name or check spelling</p>
        </div>
      )}
    </div>
  );
};

export default DrugInteractionSearch;
