
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
;
;
import { useTranslation } from '../hooks/useTranslation';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Filter, Clock, ArrowLeft, Activity } from 'lucide-react';
import PatientVitals from '@/components/patients/PatientVitals';
import { supabase } from '@/integrations/supabase/client';
import { useAsync } from '@/hooks/useAsync';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';

// Mock data for the patient list
export const MOCK_PATIENTS = [
  { id: '1', name: 'João Silva', mrn: 'MRN001', age: 45, gender: 'Masculino', roomNumber: '101' },
  { id: '2', name: 'Maria Oliveira', mrn: 'MRN002', age: 32, gender: 'Feminino', roomNumber: '102' },
  { id: '3', name: 'José Santos', mrn: 'MRN003', age: 58, gender: 'Masculino', roomNumber: '103' },
  { id: '4', name: 'Ana Costa', mrn: 'MRN004', age: 29, gender: 'Feminino', roomNumber: '201' },
];

type PatientData = typeof MOCK_PATIENTS[0];

const VitalSigns = () => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const { hasPermission } = usePermissions(user);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const location = useLocation();
  
  const canManagePatientVitals = hasPermission('document_vital_signs');
  
  // Check if patientId is passed in URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const patientId = searchParams.get('patientId');
    if (patientId) {
      setSelectedPatient(patientId);
    }
  }, [location]);
  
  const fetchPatients = async (): Promise<PatientData[]> => {
    try {
      // In a real implementation, we would fetch from Supabase
      // For now, use mock data
      return MOCK_PATIENTS;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  };
  
  // Fix: Pass the function, not the result of the function
  const { data: patients, isLoading } = useAsync<PatientData[]>(fetchPatients);
  
  return (
    <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                {selectedPatient && (
                  <Button variant="ghost" size="sm" className="mr-2 -ml-3" onClick={() => setSelectedPatient(null)}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {t('back')}
                  </Button>
                )}
                <Activity className="h-5 w-5 text-primary" />
                {t('vitals')}
              </h1>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  {t('filter')}
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Clock className="h-4 w-4" />
                  {t('recent')}
                </Button>
                {canManagePatientVitals && !selectedPatient && (
                  <Button size="sm" className="gap-1">
                    <PlusCircle className="h-4 w-4" />
                    {t('recordVitals')}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {!selectedPatient ? (
                // Patient list view (when no patient is selected)
                <>
                  <div className="lg:col-span-1">
                    <div className="glass-card p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                      <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
                        {t('patients')}
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                          {Array.isArray(patients) ? patients.length : 0}
                        </span>
                      </h2>
                      <div className="overflow-auto max-h-[calc(100vh-200px)]">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>{t('name')}</TableHead>
                                <TableHead>{t('mrn')}</TableHead>
                                <TableHead>{t('room')}</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {isLoading ? (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center py-8">
                                    <div className="flex justify-center">
                                      <div className="h-6 w-6 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                // Fixed: Check that patients is an array before calling map
                                Array.isArray(patients) && patients.map((patient) => (
                                  <TableRow
                                    key={patient.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => setSelectedPatient(patient.id)}
                                  >
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell>{patient.mrn}</TableCell>
                                    <TableCell>{patient.roomNumber}</TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className="glass-card p-6 flex items-center justify-center h-64 bg-white rounded-lg shadow-sm border border-gray-100">
                      <div className="text-center text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-lg font-medium text-muted-foreground">{t('selectPatientToViewVitals')}</p>
                        <p className="text-sm mt-2 max-w-md">
                          {language === 'pt' 
                            ? 'Selecione um paciente da lista para visualizar seus sinais vitais.'
                            : 'Select a patient from the list to view their vital signs and monitoring data.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Patient vitals view (when a patient is selected)
                <div className="lg:col-span-3">
                  <div className="glass-card p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                    <PatientVitals patientId={selectedPatient} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  );
};

export default VitalSigns;
