
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PatientSelectorFieldProps {
  patientId: string;
  onPatientSelect: (patientId: string, patientName: string) => void;
  disabled?: boolean;
}

const PatientSelectorField = ({ 
  patientId, 
  onPatientSelect,
  disabled = false
}: PatientSelectorFieldProps) => {
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState('');

  // Mock patient data - in a real app, this would come from an API
  const mockPatients = [
    { id: '101', name: 'John Doe', dob: '1980-05-15', mrn: 'MRN12345' },
    { id: '102', name: 'Jane Smith', dob: '1975-11-23', mrn: 'MRN67890' },
    { id: '103', name: 'Robert Johnson', dob: '1990-08-30', mrn: 'MRN54321' },
    { id: '104', name: 'Maria Garcia', dob: '1985-02-14', mrn: 'MRN09876' },
  ];

  // If patientId is provided and we don't have a name yet, try to find it
  React.useEffect(() => {
    if (patientId && !selectedPatientName) {
      const patient = mockPatients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatientName(patient.name);
      }
    }
  }, [patientId, selectedPatientName]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      const results = mockPatients.filter(patient => 
        patient.name.toLowerCase().includes(term.toLowerCase()) ||
        patient.id.includes(term) ||
        patient.mrn.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };
  
  const handlePatientSelect = (patient: any) => {
    onPatientSelect(patient.id, patient.name);
    setSelectedPatientName(patient.name);
    setSearchTerm('');
    setShowSearch(false);
  };
  
  return (
    <div className="space-y-3">
      <Label>
        {language === 'pt' ? 'Paciente' : 'Patient'}
      </Label>
      
      {selectedPatientName ? (
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">{selectedPatientName}</div>
              <div className="text-xs text-muted-foreground">ID: {patientId}</div>
            </div>
          </div>
          
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedPatientName('');
                onPatientSelect('', '');
              }}
            >
              {language === 'pt' ? 'Alterar' : 'Change'}
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          <Input
            id="patient-search"
            placeholder={language === 'pt' ? 'Buscar paciente pelo nome ou ID...' : 'Search patient by name or ID...'}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pr-10"
            disabled={disabled}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          
          {showSearch && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
              <ul className="py-1 max-h-60 overflow-auto">
                {searchResults.map((patient) => (
                  <li 
                    key={patient.id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'pt' ? 'Data de Nasc.' : 'DOB'}: {patient.dob} | {patient.mrn}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSelectorField;
