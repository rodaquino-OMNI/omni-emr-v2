
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { MedicationOrder } from '@/types/orders';

interface MedicationOrderFormProps {
  onDataChange: (data: Partial<MedicationOrder>) => void;
  data?: Partial<MedicationOrder>;
}

const MedicationOrderForm = ({ onDataChange, data }: MedicationOrderFormProps) => {
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [formData, setFormData] = useState<Partial<MedicationOrder>>(data || {
    substitutionAllowed: true,
    priority: 'routine'
  });
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const routes = [
    'Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical', 
    'Sublingual', 'Rectal', 'Inhaled', 'Nasal', 'Ophthalmic'
  ];
  
  useEffect(() => {
    // Pass form data to parent component when it changes
    onDataChange({
      ...formData,
      duration: startDate && endDate 
        ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days` 
        : formData.duration
    });
  }, [formData, startDate, endDate, onDataChange]);
  
  const handleInputChange = (field: keyof MedicationOrder, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const searchMedications = (term: string) => {
    // This would be an API call to a medication database in a real app
    // Simulating search results
    const mockResults = [
      { id: 1, name: 'Acetaminophen 500mg Tablet', generic: 'Acetaminophen' },
      { id: 2, name: 'Ibuprofen 400mg Tablet', generic: 'Ibuprofen' },
      { id: 3, name: 'Amoxicillin 500mg Capsule', generic: 'Amoxicillin' },
      { id: 4, name: 'Lisinopril 10mg Tablet', generic: 'Lisinopril' },
      { id: 5, name: 'Atorvastatin 20mg Tablet', generic: 'Atorvastatin' },
      { id: 6, name: 'Metformin 500mg Tablet', generic: 'Metformin' },
      { id: 7, name: 'Sertraline 50mg Tablet', generic: 'Sertraline' },
      { id: 8, name: 'Albuterol 90mcg Inhaler', generic: 'Albuterol' }
    ].filter(med => 
      med.name.toLowerCase().includes(term.toLowerCase()) || 
      med.generic.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(mockResults);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      searchMedications(term);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };
  
  const selectMedication = (medication: any) => {
    setFormData(prev => ({
      ...prev,
      medicationName: medication.name
    }));
    setSearchTerm(medication.name);
    setShowSearch(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="medication-search">
          {language === 'pt' ? 'Buscar Medicamento' : 'Search Medication'}
        </Label>
        <div className="relative">
          <Input
            id="medication-search"
            placeholder={language === 'pt' ? 'Digite para buscar...' : 'Type to search...'}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          
          {showSearch && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
              <ul className="py-1 max-h-60 overflow-auto">
                {searchResults.map((med) => (
                  <li 
                    key={med.id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer"
                    onClick={() => selectMedication(med)}
                  >
                    <div className="font-medium">{med.name}</div>
                    <div className="text-xs text-muted-foreground">{med.generic}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="dosage">
            {language === 'pt' ? 'Dosagem' : 'Dosage'}
          </Label>
          <Input
            id="dosage"
            placeholder={language === 'pt' ? 'Ex: 500mg' : 'Ex: 500mg'}
            value={formData.dosage || ''}
            onChange={(e) => handleInputChange('dosage', e.target.value)}
          />
        </div>
        
        <div className="space-y-1.5">
          <Label htmlFor="frequency">
            {language === 'pt' ? 'Frequência' : 'Frequency'}
          </Label>
          <Input
            id="frequency"
            placeholder={language === 'pt' ? 'Ex: A cada 8 horas' : 'Ex: Every 8 hours'}
            value={formData.frequency || ''}
            onChange={(e) => handleInputChange('frequency', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Via de Administração' : 'Administration Route'}
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {routes.map((route) => (
            <Button 
              key={route}
              type="button"
              variant={formData.route === route ? 'default' : 'outline'}
              className="text-xs h-8"
              onClick={() => handleInputChange('route', route)}
            >
              {route}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>
            {language === 'pt' ? 'Data de Início' : 'Start Date'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : (language === 'pt' ? 'Selecionar data' : 'Select date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-1.5">
          <Label>
            {language === 'pt' ? 'Data de Término' : 'End Date'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : (language === 'pt' ? 'Selecionar data' : 'Select date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < (startDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="instructions">
          {language === 'pt' ? 'Instruções' : 'Instructions'}
        </Label>
        <Textarea
          id="instructions"
          placeholder={language === 'pt' ? 'Ex: Tomar com alimentos' : 'Ex: Take with food'}
          value={formData.instructions || ''}
          onChange={(e) => handleInputChange('instructions', e.target.value)}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Substituição Permitida' : 'Substitution Allowed'}
        </Label>
        <RadioGroup 
          value={formData.substitutionAllowed ? "true" : "false"}
          onValueChange={(value) => handleInputChange('substitutionAllowed', value === 'true')}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="substitution-yes" />
            <Label htmlFor="substitution-yes">
              {language === 'pt' ? 'Sim' : 'Yes'}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="substitution-no" />
            <Label htmlFor="substitution-no">
              {language === 'pt' ? 'Não' : 'No'}
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-1.5">
        <Label>
          {language === 'pt' ? 'Prioridade' : 'Priority'}
        </Label>
        <RadioGroup 
          value={formData.priority || "routine"}
          onValueChange={(value: 'routine' | 'urgent' | 'stat') => handleInputChange('priority', value)}
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
  );
};

export default MedicationOrderForm;
