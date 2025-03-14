
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import EmergencyTriageWorkflow from '@/components/emergency/EmergencyTriageWorkflow';

// Mock data for emergency department patients
const MOCK_ED_PATIENTS = [
  { 
    id: '1', 
    name: 'Robert Johnson', 
    age: 67, 
    arrivalTime: '08:15', 
    chiefComplaint: 'Chest pain', 
    triageLevel: 'immediate',
    waitTime: '0 min'
  },
  { 
    id: '2', 
    name: 'Maria Garcia', 
    age: 42, 
    arrivalTime: '08:30', 
    chiefComplaint: 'Abdominal pain', 
    triageLevel: 'urgent',
    waitTime: '15 min'
  },
  { 
    id: '3', 
    name: 'David Lee', 
    age: 25, 
    arrivalTime: '08:45', 
    chiefComplaint: 'Sprained ankle', 
    triageLevel: 'semi-urgent',
    waitTime: '35 min'
  },
  { 
    id: '4', 
    name: 'Emma Wilson', 
    age: 8, 
    arrivalTime: '09:00', 
    chiefComplaint: 'Fever, cough', 
    triageLevel: 'urgent',
    waitTime: '20 min'
  },
];

const EmergencyCarePage = () => {
  const { t, language } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  
  // Find the selected patient's full details
  const selectedPatientDetails = MOCK_ED_PATIENTS.find(p => p.id === selectedPatient);
  
  // Get triage level badge color
  const getTriageLevelBadge = (level: string) => {
    switch(level) {
      case 'immediate':
        return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">
          <AlertTriangle className="inline h-3 w-3 mr-1" />
          {t('immediate')}
        </span>;
      case 'emergent':
        return <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-medium">{t('emergent')}</span>;
      case 'urgent':
        return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">{t('urgent')}</span>;
      case 'semi-urgent':
        return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">{t('semiUrgent')}</span>;
      case 'non-urgent':
        return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">{t('nonUrgent')}</span>;
      default:
        return <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium">{t('notTriaged')}</span>;
    }
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
                {t('emergencyCare')}
              </h1>
              
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                {t('registerNewPatient')}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="glass-card p-4">
                  <h2 className="text-lg font-medium mb-3">{t('emergencyDepartment')}</h2>
                  <div className="overflow-auto max-h-[calc(100vh-200px)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('patient')}</TableHead>
                          <TableHead>{t('triage')}</TableHead>
                          <TableHead>{t('wait')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_ED_PATIENTS.map((patient) => (
                          <TableRow
                            key={patient.id}
                            className={`cursor-pointer hover:bg-muted/50 ${
                              selectedPatient === patient.id ? 'bg-muted/70' : ''
                            }`}
                            onClick={() => setSelectedPatient(patient.id)}
                          >
                            <TableCell className="font-medium">
                              <div>
                                {patient.name}
                                <div className="text-xs text-muted-foreground">{patient.chiefComplaint}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getTriageLevelBadge(patient.triageLevel)}</TableCell>
                            <TableCell>{patient.waitTime}</TableCell>
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
                            {t('age')}: {selectedPatientDetails.age} | {t('arrivalTime')}: {selectedPatientDetails.arrivalTime}
                          </p>
                        </div>
                      </div>
                      
                      <EmergencyTriageWorkflow 
                        patientId={selectedPatient}
                        patientName={selectedPatientDetails.name}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      {t('selectPatientToViewEmergencyCare')}
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

export default EmergencyCarePage;
