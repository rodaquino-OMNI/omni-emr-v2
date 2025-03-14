
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import AdmissionDischargeWorkflow from '@/components/hospital/AdmissionDischargeWorkflow';

// Mock inpatient data
const MOCK_INPATIENTS = [
  { id: '1', name: 'John Doe', mrn: 'MRN001', age: 45, gender: 'Male', room: '101', admissionDate: '2023-07-15' },
  { id: '2', name: 'Jane Smith', mrn: 'MRN002', age: 32, gender: 'Female', room: '102', admissionDate: '2023-07-16' },
  { id: '3', name: 'Michael Johnson', mrn: 'MRN003', age: 58, gender: 'Male', room: '103', admissionDate: '2023-07-14' },
  { id: '4', name: 'Sarah Williams', mrn: 'MRN004', age: 29, gender: 'Female', room: '201', admissionDate: '2023-07-17' },
];

const HospitalWorkflowsPage = () => {
  const { t, language } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  // Find the selected patient's full details
  const selectedPatientDetails = MOCK_INPATIENTS.find(p => p.id === selectedPatient);
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
                {t('hospitalWorkflows')}
              </h1>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="glass-card p-4">
                  <h2 className="text-lg font-medium mb-3">{t('inpatients')}</h2>
                  <div className="overflow-auto max-h-[calc(100vh-200px)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('name')}</TableHead>
                          <TableHead>{t('mrn')}</TableHead>
                          <TableHead>{t('room')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_INPATIENTS.map((patient) => (
                          <TableRow
                            key={patient.id}
                            className={`cursor-pointer hover:bg-muted/50 ${
                              selectedPatient === patient.id ? 'bg-muted/70' : ''
                            }`}
                            onClick={() => setSelectedPatient(patient.id)}
                          >
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell>{patient.mrn}</TableCell>
                            <TableCell>{patient.room}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="glass-card p-4">
                  {selectedPatient && selectedPatientDetails ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-semibold">{selectedPatientDetails.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {t('mrn')}: {selectedPatientDetails.mrn} | {t('room')}: {selectedPatientDetails.room} | 
                            {t('admittedOn')}: {selectedPatientDetails.admissionDate}
                          </p>
                        </div>
                      </div>
                      
                      <AdmissionDischargeWorkflow 
                        patientId={selectedPatient}
                        patientName={selectedPatientDetails.name}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      {t('selectPatientToViewWorkflows')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HospitalWorkflowsPage;
