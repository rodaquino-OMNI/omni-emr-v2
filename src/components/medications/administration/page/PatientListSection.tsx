
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Clock } from 'lucide-react';

// Mock data for the patient list
const MOCK_PATIENTS = [
  { id: '1', name: 'John Doe', mrn: 'MRN001', age: 45, gender: 'Male', roomNumber: '101', medsDue: 3 },
  { id: '2', name: 'Jane Smith', mrn: 'MRN002', age: 32, gender: 'Female', roomNumber: '102', medsDue: 0 },
  { id: '3', name: 'Michael Johnson', mrn: 'MRN003', age: 58, gender: 'Male', roomNumber: '103', medsDue: 1 },
  { id: '4', name: 'Sarah Williams', mrn: 'MRN004', age: 29, gender: 'Female', roomNumber: '201', medsDue: 2 },
];

interface PatientListSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPatient: string | null;
  setSelectedPatient: (id: string | null) => void;
}

const PatientListSection: React.FC<PatientListSectionProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedPatient, 
  setSelectedPatient 
}) => {
  const { t } = useTranslation();
  
  // Filter patients based on search term
  const filteredPatients = MOCK_PATIENTS.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>{t('patients')}</CardTitle>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3.5 w-3.5" />
              {filteredPatients.reduce((acc, p) => acc + p.medsDue, 0)} {t('medicationsDue') || 'meds due'}
            </Badge>
          </div>
          <CardDescription>
            {t('selectPatientToViewMedications')}
          </CardDescription>
          
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={t('searchPatients') || "Search patients..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[calc(100vh-270px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('mrn')}</TableHead>
                  <TableHead>{t('room')}</TableHead>
                  <TableHead className="text-right">{t('due')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow
                    key={patient.id}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      selectedPatient === patient.id ? 'bg-muted/70' : ''
                    }`}
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.mrn}</TableCell>
                    <TableCell>{patient.roomNumber}</TableCell>
                    <TableCell className="text-right">
                      {patient.medsDue > 0 && (
                        <Badge variant={patient.medsDue > 2 ? "destructive" : "secondary"} className="ml-auto">
                          {patient.medsDue}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientListSection;
