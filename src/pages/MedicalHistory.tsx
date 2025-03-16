
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { usePatientData } from '@/hooks/usePatientData';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import PatientMedicalHistory from '@/components/patients/PatientMedicalHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';

const MedicalHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useTranslation();
  const { patient, isLoading } = usePatientData(id || '');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  if (!patient) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <Link to="/patients" className="inline-flex items-center mb-4 text-muted-foreground hover:text-foreground">
                <ChevronLeft className="h-4 w-4 mr-1" />
                {language === 'pt' ? 'Voltar para pacientes' : 'Back to patients'}
              </Link>
              
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-xl font-bold text-red-500">
                    {language === 'pt' ? 'Paciente não encontrado' : 'Patient not found'}
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    {language === 'pt' 
                      ? 'O paciente solicitado não pôde ser encontrado.' 
                      : 'The requested patient could not be found.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link 
                  to={`/patients/${id}`} 
                  className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {language === 'pt' ? 'Voltar ao paciente' : 'Back to patient'}
                </Link>
                
                <h1 className="text-2xl font-bold">
                  {language === 'pt' ? 'Histórico médico' : 'Medical History'}
                </h1>
              </div>
            </div>
            
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">
                  {`${patient.first_name} ${patient.last_name}`}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {language === 'pt' ? 'MRN: ' : 'MRN: '}{patient.mrn} | 
                  {language === 'pt' ? ' Data de nascimento: ' : ' DOB: '}
                  {new Date(patient.date_of_birth).toLocaleDateString()}
                </div>
              </CardHeader>
            </Card>
            
            <PatientMedicalHistory patientId={id || ''} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
