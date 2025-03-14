
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface LabTestSelectorProps {
  onAddTest: (test: string) => void;
}

const LabTestSelector = ({ onAddTest }: LabTestSelectorProps) => {
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  
  const allLabTests = [
    { id: 'cbc', name: language === 'pt' ? 'Hemograma completo' : 'Complete Blood Count (CBC)' },
    { id: 'bmp', name: language === 'pt' ? 'Painel metabólico básico' : 'Basic Metabolic Panel (BMP)' },
    { id: 'cmp', name: language === 'pt' ? 'Painel metabólico completo' : 'Comprehensive Metabolic Panel (CMP)' },
    { id: 'lipid', name: language === 'pt' ? 'Perfil lipídico' : 'Lipid Panel' },
    { id: 'thyroid', name: language === 'pt' ? 'Painel tireoidiano' : 'Thyroid Panel' },
    { id: 'hba1c', name: language === 'pt' ? 'Hemoglobina glicada (HbA1c)' : 'Hemoglobin A1c (HbA1c)' },
    { id: 'crp', name: language === 'pt' ? 'Proteína C-reativa' : 'C-Reactive Protein (CRP)' },
    { id: 'troponin', name: language === 'pt' ? 'Troponina' : 'Troponin' },
    { id: 'urinalysis', name: language === 'pt' ? 'Análise de urina' : 'Urinalysis' },
    { id: 'covid', name: language === 'pt' ? 'Teste COVID-19' : 'COVID-19 Test' },
    { id: 'culture', name: language === 'pt' ? 'Cultura e sensibilidade' : 'Culture and Sensitivity' }
  ];
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      const results = allLabTests.filter(test => 
        test.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };
  
  const handleTestSelect = (test: any) => {
    onAddTest(test.name);
    setSearchTerm('');
    setShowSearch(false);
  };
  
  return (
    <div className="space-y-1.5">
      <Label htmlFor="test-search">
        {language === 'pt' ? 'Buscar Exames' : 'Search Tests'}
      </Label>
      <div className="relative">
        <Input
          id="test-search"
          placeholder={language === 'pt' ? 'Digite para buscar exames...' : 'Type to search for tests...'}
          value={searchTerm}
          onChange={handleSearchChange}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        {showSearch && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {searchResults.map((test) => (
                <li 
                  key={test.id}
                  className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                  onClick={() => handleTestSelect(test)}
                >
                  <span>{test.name}</span>
                  <Plus className="h-4 w-4 text-primary" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabTestSelector;
