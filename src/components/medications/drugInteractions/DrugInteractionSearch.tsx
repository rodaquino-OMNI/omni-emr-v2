
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMedications } from "@/services/rxnorm/rxnormService";

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

  // Search for medications when debounced search term changes
  React.useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchMedications(debouncedSearchTerm);
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
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search medication..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pr-8"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="border rounded-md overflow-hidden">
          <ul className="divide-y">
            {searchResults.map((med) => (
              <li key={med.rxcui} className="p-2 hover:bg-muted cursor-pointer flex items-center justify-between">
                <span>{med.name}</span>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={() => onAddMedication(med)}
                >
                  Add
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isSearching && (
        <div className="text-center p-4">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full inline-block mr-2"></div>
          Searching...
        </div>
      )}

      {!isSearching && debouncedSearchTerm.trim().length >= 2 && searchResults.length === 0 && (
        <div className="text-center p-4 text-muted-foreground">
          No medications found for "{debouncedSearchTerm}"
        </div>
      )}
    </div>
  );
};

export default DrugInteractionSearch;
