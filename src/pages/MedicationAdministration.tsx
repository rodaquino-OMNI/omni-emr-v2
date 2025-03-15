
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import MedicationAdministrationRecord from '@/components/medications/administration/MedicationAdministrationRecord';
import { Shield, Search, FileBarChart, QrCode, Filter, Clock, Medal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for the patient list
const MOCK_PATIENTS = [
  { id: '1', name: 'John Doe', mrn: 'MRN001', age: 45, gender: 'Male', roomNumber: '101', medsDue: 3 },
  { id: '2', name: 'Jane Smith', mrn: 'MRN002', age: 32, gender: 'Female', roomNumber: '102', medsDue: 0 },
  { id: '3', name: 'Michael Johnson', mrn: 'MRN003', age: 58, gender: 'Male', roomNumber: '103', medsDue: 1 },
  { id: '4', name: 'Sarah Williams', mrn: 'MRN004', age: 29, gender: 'Female', roomNumber: '201', medsDue: 2 },
];

const MedicationAdministrationPage = () => {
  const { t, language } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [scanMode, setScanMode] = useState(false);
  
  // Filter patients based on search term
  const filteredPatients = MOCK_PATIENTS.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">
                    {t('medicationAdministration')}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pt' 
                      ? 'Segurança aprimorada com scanner e verificação' 
                      : 'Enhanced safety with scanning and verification'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={() => setScanMode(!scanMode)}
                >
                  <QrCode className="h-4 w-4" />
                  {scanMode ? t('exitScanMode') || 'Exit Scan Mode' : t('scanMode') || 'Scan Mode'}
                </Button>
                
                <Button className="gap-2">
                  <FileBarChart className="h-4 w-4" />
                  {t('reports') || 'Reports'}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>
                        {selectedPatient 
                          ? MOCK_PATIENTS.find(p => p.id === selectedPatient)?.name + ' - ' + t('medications')
                          : t('medications')}
                      </CardTitle>
                      
                      {selectedPatient && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800/30">
                            <Medal className="h-3.5 w-3.5" />
                            {language === 'pt' ? 'Verificado por IA' : 'AI-Verified'}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {selectedPatient && (
                      <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="mt-3">
                        <TabsList className="bg-muted/50">
                          <TabsTrigger value="scheduled">
                            {t('scheduled') || 'Scheduled'}
                          </TabsTrigger>
                          <TabsTrigger value="prn">
                            {t('prn') || 'PRN'}
                          </TabsTrigger>
                          <TabsTrigger value="administered">
                            {t('administered') || 'Administered'}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    {selectedPatient ? (
                      <div className="pt-2">
                        <MedicationAdministrationRecord patientId={selectedPatient} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Shield className="h-16 w-16 mb-4 text-muted-foreground/30" />
                        <p className="font-medium mb-2">
                          {t('selectPatientToViewMedications')}
                        </p>
                        <p className="text-sm max-w-md text-center">
                          {language === 'pt' 
                            ? 'Selecione um paciente da lista à esquerda para visualizar e administrar medicamentos com verificação aprimorada de segurança.'
                            : 'Select a patient from the list on the left to view and administer medications with enhanced safety verification.'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  
                  {selectedPatient && (
                    <CardFooter className="border-t pt-4 flex justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{language === 'pt' ? 'Última atualização:' : 'Last updated:'} 2 {language === 'pt' ? 'minutos atrás' : 'minutes ago'}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5 text-green-500" />
                        <span>{language === 'pt' ? 'Verificação de segurança ativa' : 'Safety verification active'}</span>
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicationAdministrationPage;
