
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { LaboratoryOrder } from '@/types/orders';

interface LaboratoryOrderFormProps {
  onDataChange: (data: Partial<LaboratoryOrder>) => void;
  data?: Partial<LaboratoryOrder>;
}

const LaboratoryOrderForm = ({ onDataChange, data }: LaboratoryOrderFormProps) => {
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [formData, setFormData] = useState<Partial<LaboratoryOrder>>(data || {
    tests: [],
    frequency: 'once',
    clinicalReason: ''
  });
  
  // Available frequency options
  const frequencyOptions = [
    { value: 'once', label: language === 'pt' ? 'Uma vez' : 'Once' },
    { value: 'daily', label: language === 'pt' ? 'Diariamente' : 'Daily' },
    { value: 'weekly', label: language === 'pt' ? 'Semanalmente' : 'Weekly' },
    { value: 'monthly', label: language === 'pt' ? 'Mensalmente' : 'Monthly' }
  ];
  
  // Mock lab tests
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
  
  useEffect(() => {
    // Pass form data to parent component when it changes
    onDataChange(formData);
  }, [formData]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      // Filter lab tests based on search term
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
  
  const addTest = (test: any) => {
    setFormData(prev => ({
      ...prev,
      tests: [...(prev.tests || []), test.name]
    }));
    setSearchTerm('');
    setShowSearch(false);
  };
  
  const removeTest = (testToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tests: (prev.tests || []).filter(test => test !== testToRemove)
    }));
  };
  
  const handleInputChange = (field: keyof LaboratoryOrder, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <div className="space-y-4">
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
                    onClick={() => addTest(test)}
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
      
      <div className="space-y-2">
        <Label>
          {language === 'pt' ? 'Exames Selecionados' : 'Selected Tests'}
        </Label>
        <div className="p-3 border rounded-md min-h-[100px]">
          {formData.tests && formData.tests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.tests.map((test, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="flex items-center gap-1 py-1.5 pl-3 pr-2"
                >
                  {test}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 rounded-full ml-1"
                    onClick={() => removeTest(test)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              {language === 'pt' 
                ? 'Nenhum exame selecionado. Use a busca acima para adicionar exames.' 
                : 'No tests selected. Use the search above to add tests.'
              }
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Frequência' : 'Frequency'}
        </Label>
        <RadioGroup 
          value={formData.frequency || 'once'}
          onValueChange={(value) => handleInputChange('frequency', value)}
          className="flex flex-wrap gap-4"
        >
          {frequencyOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`frequency-${option.value}`} />
              <Label htmlFor={`frequency-${option.value}`}>
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="clinical-reason">
          {language === 'pt' ? 'Razão Clínica' : 'Clinical Reason'}
        </Label>
        <Textarea
          id="clinical-reason"
          placeholder={language === 'pt' 
            ? 'Descreva a razão clínica para estes exames...' 
            : 'Describe the clinical reason for these tests...'
          }
          value={formData.clinicalReason || ''}
          onChange={(e) => handleInputChange('clinicalReason', e.target.value)}
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="specimen-type">
            {language === 'pt' ? 'Tipo de Amostra' : 'Specimen Type'}
          </Label>
          <Input
            id="specimen-type"
            placeholder={language === 'pt' ? 'Ex: Sangue, Urina' : 'Ex: Blood, Urine'}
            value={formData.specimenType || ''}
            onChange={(e) => handleInputChange('specimenType', e.target.value)}
          />
        </div>
        
        <div className="space-y-1.5">
          <Label>
            {language === 'pt' ? 'Prioridade' : 'Priority'}
          </Label>
          <RadioGroup 
            defaultValue={formData.priority || "routine"}
            onValueChange={(value) => handleInputChange('priority', value)}
          >
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="routine" id="priority-routine" />
                <Label htmlFor="priority-routine">
                  {language === 'pt' ? 'Rotina' : 'Routine'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="priority-urgent" />
                <Label htmlFor="priority-urgent">
                  {language === 'pt' ? 'Urgente' : 'Urgent'}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stat" id="priority-stat" />
                <Label htmlFor="priority-stat">
                  {language === 'pt' ? 'Imediato' : 'STAT'}
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="collection-instructions">
          {language === 'pt' ? 'Instruções de Coleta' : 'Collection Instructions'}
        </Label>
        <Textarea
          id="collection-instructions"
          placeholder={language === 'pt' 
            ? 'Instruções especiais para coleta da amostra...' 
            : 'Special instructions for specimen collection...'
          }
          value={formData.collectionInstructions || ''}
          onChange={(e) => handleInputChange('collectionInstructions', e.target.value)}
          rows={2}
        />
      </div>
    </div>
  );
};

export default LaboratoryOrderForm;
