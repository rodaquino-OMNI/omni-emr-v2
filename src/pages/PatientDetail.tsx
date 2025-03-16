
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useSectorContext } from '@/hooks/useSectorContext';
import PatientHeader from '@/components/patients/PatientHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import PatientRecordsTab from '@/components/patients/tabs/PatientRecordsTab';
import PatientPrescriptionsTab from '@/components/patients/tabs/PatientPrescriptionsTab';
import PatientAIInsightsTab from '@/components/patients/tabs/PatientAIInsightsTab';

// Dummy data for patient tabs that require additional props
const dummyInsights = [];
const dummyPrescriptions = [];

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedSector, sectorPatients } = useSectorContext();
  const [activeTab, setActiveTab] = useState('overview');
  
  // If no sector is selected, redirect to sector selection
  useEffect(() => {
    if (!selectedSector) {
      navigate('/sectors');
    }
  }, [selectedSector, navigate]);
  
  // Find the patient in the current sector
  const patient = sectorPatients.find(p => p.id === id);
  
  // If patient not found in this sector, show appropriate message
  if (!patient) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Patient Not Found</h2>
                <p className="text-muted-foreground mb-4">
                  The patient you're looking for is not in the current sector or doesn't exist.
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/patients')}
                >
                  Back to Patients
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // Create a Patient object from SectorPatient for the PatientHeader
  const patientForHeader = {
    ...patient,
    name: `${patient.first_name} ${patient.last_name}`,
    age: patient.date_of_birth ? calculateAge(new Date(patient.date_of_birth)) : '',
    diagnosis: 'Not available' // Add placeholder for required field
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <PatientHeader patient={patientForHeader} />
          
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <Tabs 
                defaultValue="overview" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-4 w-full justify-start border-b pb-0 bg-transparent">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="records">Records</TabsTrigger>
                  <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                  <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                  <PatientOverviewTab 
                    patientId={patient.id} 
                    insights={dummyInsights} 
                    prescriptions={dummyPrescriptions} 
                  />
                </TabsContent>
                
                <TabsContent value="records" className="mt-4">
                  <PatientRecordsTab patientId={patient.id} />
                </TabsContent>
                
                <TabsContent value="prescriptions" className="mt-4">
                  <PatientPrescriptionsTab patientId={patient.id} />
                </TabsContent>
                
                <TabsContent value="ai-insights" className="mt-4">
                  <PatientAIInsightsTab 
                    insights={dummyInsights} 
                    loading={false} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper function to calculate age from birthdate
const calculateAge = (birthDate: Date): string => {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age.toString();
};

export default PatientDetail;
