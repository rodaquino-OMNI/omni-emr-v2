
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useSectorContext } from '@/hooks/useSectorContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import PatientHeader from '@/components/patients/PatientHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import PatientRecordsTab from '@/components/patients/tabs/PatientRecordsTab';
import PatientPrescriptionsTab from '@/components/patients/tabs/PatientPrescriptionsTab';
import PatientAIInsightsTab from '@/components/patients/tabs/PatientAIInsightsTab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

// Dummy data for patient tabs that require additional props
const dummyInsights = [];
const dummyPrescriptions = [];

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedSector, sectorPatients } = useSectorContext();
  const [activeTab, setActiveTab] = useState('overview');
  const { canAccessPatientData, canPerformActionInSector } = usePermissions(user);
  const [isLoggingAccess, setIsLoggingAccess] = useState(false);
  
  // If no sector is selected, redirect to sector selection
  useEffect(() => {
    if (!selectedSector) {
      navigate('/sectors');
    }
  }, [selectedSector, navigate]);
  
  // Find the patient in the current sector
  const patient = sectorPatients.find(p => p.id === id);

  // Log patient access for audit purposes
  useEffect(() => {
    const logPatientAccess = async () => {
      if (patient && user && !isLoggingAccess) {
        setIsLoggingAccess(true);
        try {
          await supabase.from('extended_audit_logs').insert({
            user_id: user.id,
            action: 'view',
            resource_type: 'Patient',
            resource_id: patient.id,
            patient_id: patient.id,
            access_type: 'standard_access',
            access_reason: 'clinical_care',
            details: {
              patient_name: `${patient.first_name} ${patient.last_name}`,
              sector_id: selectedSector?.id,
              sector_name: selectedSector?.name
            }
          });
        } catch (error) {
          console.error('Error logging patient access:', error);
        } finally {
          setIsLoggingAccess(false);
        }
      }
    };

    logPatientAccess();
  }, [patient, user, selectedSector, isLoggingAccess]);
  
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
                <Button 
                  onClick={() => navigate('/patients')}
                  className="mr-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Patients
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Check if the user has permission to access this patient's data
  const hasAccess = canAccessPatientData(patient.id);
  
  // If no access, show unauthorized message
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <div className="bg-destructive/10 rounded-lg p-8 text-center">
                <ShieldAlert className="h-12 w-12 text-destructive mx-auto mb-2" />
                <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-4">
                  You don't have permission to access this patient's information.
                </p>
                <Button 
                  onClick={() => navigate('/patients')}
                  variant="outline"
                  className="mr-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Patients
                </Button>
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
    age: patient.date_of_birth ? parseInt(calculateAge(new Date(patient.date_of_birth))) : 0, // Convert to number
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
                  {canPerformActionInSector('view', selectedSector?.id || '') && (
                    <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                  )}
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
                
                {canPerformActionInSector('view', selectedSector?.id || '') && (
                  <TabsContent value="ai-insights" className="mt-4">
                    <PatientAIInsightsTab 
                      insights={dummyInsights} 
                      loading={false} 
                    />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper function to calculate age from birthdate - returns string but we'll convert it later
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
