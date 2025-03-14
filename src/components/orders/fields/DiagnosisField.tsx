
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Plus, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface DiagnosisFieldProps {
  diagnoses: string[];
  onDiagnosisChange: (diagnoses: string[]) => void;
}

const DiagnosisField = ({ diagnoses, onDiagnosisChange }: DiagnosisFieldProps) => {
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  
  // Mock ICD-10 codes - in a real app, this would come from an API
  const mockDiagnoses = [
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated' },
    { code: 'M54.5', description: 'Low back pain' },
    { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
    { code: 'R51', description: 'Headache' },
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
    { code: 'G47.00', description: 'Insomnia, unspecified' },
  ];
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      const results = mockDiagnoses.filter(diagnosis => 
        diagnosis.description.toLowerCase().includes(term.toLowerCase()) ||
        diagnosis.code.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };
  
  const addDiagnosis = (diagnosis: any) => {
    const diagnosisText = `${diagnosis.code} - ${diagnosis.description}`;
    if (!diagnoses.includes(diagnosisText)) {
      onDiagnosisChange([...diagnoses, diagnosisText]);
    }
    setSearchTerm('');
    setShowSearch(false);
  };
  
  const removeDiagnosis = (diagnosisToRemove: string) => {
    onDiagnosisChange(diagnoses.filter(d => d !== diagnosisToRemove));
  };
  
  return (
    <div className="space-y-3">
      <Label htmlFor="diagnosis-search">
        {language === 'pt' ? 'Diagnóstico' : 'Diagnosis'}
      </Label>
      
      <div className="relative">
        <Input
          id="diagnosis-search"
          placeholder={language === 'pt' ? 'Buscar diagnóstico...' : 'Search diagnosis...'}
          value={searchTerm}
          onChange={handleSearchChange}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        {showSearch && searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
            <ul className="py-1 max-h-60 overflow-auto">
              {searchResults.map((diagnosis) => (
                <li 
                  key={diagnosis.code}
                  className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                  onClick={() => addDiagnosis(diagnosis)}
                >
                  <div>
                    <span className="font-medium">{diagnosis.code}</span> - {diagnosis.description}
                  </div>
                  <Plus className="h-4 w-4 text-primary" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {diagnoses.length > 0 ? (
        <div className="flex flex-wrap gap-2 p-3 border rounded-md">
          {diagnoses.map((diagnosis, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="flex items-center gap-1 py-1.5 pl-3 pr-2"
            >
              {diagnosis}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 rounded-full ml-1"
                onClick={() => removeDiagnosis(diagnosis)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <div className="p-3 border border-dashed rounded-md flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            {language === 'pt' 
              ? 'Nenhum diagnóstico adicionado. Utilize a busca acima.'
              : 'No diagnoses added. Use the search above to add.'}
          </span>
        </div>
      )}
    </div>
  );
};

export default DiagnosisField;
