import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import PatientHeader from '@/components/patients/PatientHeader';
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import PatientRecordsTab from '@/components/patients/tabs/PatientRecordsTab';
import PatientPrescriptionsTab from '@/components/patients/tabs/PatientPrescriptionsTab';
import PatientAIInsightsTab from '@/components/patients/tabs/PatientAIInsightsTab';
import { Patient, mapToPatientStatus } from '@/types/patientTypes';

// Mock data for now (would come from API)
const mockPatients = [
  {
    id: 'patient-1',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1980-01-01',
    gender: 'Male',
    mrn: '123456',
    status: 'hospital',
    is_assigned: true,
    room_number: '101',
    age: 43,
    diagnosis: 'Hypertension',
    name: 'John Doe'
  },
  {
    id: 'patient-2',
    first_name: 'Jane',
    last_name: 'Smith',
    date_of_birth: '1990-05-15',
    gender: 'Female',
    mrn: '789012',
    status: 'home',
    is_assigned: true,
    room_number: '202',
    age: 33,
    diagnosis: 'Diabetes',
    name: 'Jane Smith'
  },
  {
    id: 'patient-3',
    first_name: 'Robert',
    last_name: 'Jones',
    date_of_birth: '1975-11-20',
    gender: 'Male',
    mrn: '345678',
    status: 'discharged',
    is_assigned: false,
    room_number: null,
    age: 47,
    diagnosis: 'Asthma',
    name: 'Robert Jones'
  }
];

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for now (would come from API)
  const patientId = id || '';
  
  // Fetch patient data
  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      if (!patientId) return null;
      
      // First check if the table exists and we can connect
      const { data: connected, error: connError } = await supabase.rpc('check_connection');
      
      if (connError || !connected) {
        console.error('Database connection error:', connError);
        // Return mock data as fallback
        return mockPatients.find(p => p.id === patientId) || null;
      }
      
      // Try to get from the new patient_status_view first
      const { data: viewData, error: viewError } = await supabase
        .from('patient_status_view')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (!viewError && viewData) {
        // Convert to Patient type with proper status mapping
        return {
          id: viewData.id,
          first_name: viewData.first_name,
          last_name: viewData.last_name,
          name: `${viewData.first_name} ${viewData.last_name}`,
          date_of_birth: viewData.date_of_birth,
          gender: viewData.gender,
          mrn: viewData.mrn,
          room_number: viewData.room_number,
          // Map the status string to PatientStatus enum type
          status: mapToPatientStatus(viewData.mapped_status || 'stable'),
          is_assigned: true, // Default value
          // Calculate age from date of birth
          age: calculateAge(viewData.date_of_birth),
          diagnosis: "Primary diagnosis information would be fetched separately"
        };
      }
      
      // Fallback to patients table if view doesn't exist
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (error) {
        console.error('Error fetching patient:', error);
        // Return mock data as fallback
        return mockPatients.find(p => p.id === patientId) || null;
      }
      
      // Convert to Patient type
      return {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        name: `${data.first_name} ${data.last_name}`,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        mrn: data.mrn,
        room_number: data.room_number,
        // Map the status string to PatientStatus enum type
        status: mapToPatientStatus(data.status || 'stable'),
        is_assigned: true, // Default for the detail view
        // Calculate age from date of birth
        age: calculateAge(data.date_of_birth),
        diagnosis: "Primary diagnosis information would be fetched separately"
      };
    },
    enabled: !!patientId
  });
  
  // Mock data for insights, records, and prescriptions
  const { data: insights, isLoading: insightsLoading } = useQuery({
    queryKey: ['patientInsights', patientId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 'insight-1', text: 'Patient has a history of hypertension.' },
        { id: 'insight-2', text: 'Patient is currently taking medication for diabetes.' }
      ];
    },
    enabled: !!patientId
  });
  
  const { data: records, isLoading: recordsLoading } = useQuery({
    queryKey: ['patientRecords', patientId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 'record-1', type: 'Lab Report', date: '2023-01-01', description: 'Complete blood count' },
        { id: 'record-2', type: 'Imaging', date: '2023-02-15', description: 'X-ray of chest' }
      ];
    },
    enabled: !!patientId
  });
  
  const { data: prescriptions, isLoading: prescriptionsLoading } = useQuery({
    queryKey: ['patientPrescriptions', patientId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 'prescription-1', medication: 'Lisinopril', dosage: '10mg', refills: 3 },
        { id: 'prescription-2', medication: 'Metformin', dosage: '500mg', refills: 2 }
      ];
    },
    enabled: !!patientId
  });
  
  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  if (patientLoading) return <div>Loading patient data...</div>;
  if (!patient) return <div>Patient not found.</div>;
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="space-y-4">
            <Button variant="secondary" onClick={() => navigate('/patients')}>
              Back to Patients
            </Button>
            
            <PatientHeader patient={patient} />
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="records">Medical Records</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-2">
                <PatientOverviewTab patientId={patientId} insights={insights || []} prescriptions={prescriptions || []} />
              </TabsContent>
              <TabsContent value="records" className="space-y-2">
                <PatientRecordsTab patientId={patientId} records={records || []} />
              </TabsContent>
              <TabsContent value="prescriptions" className="space-y-2">
                <PatientPrescriptionsTab patientId={patientId} prescriptions={prescriptions || []} />
              </TabsContent>
              <TabsContent value="ai-insights" className="space-y-2">
                <PatientAIInsightsTab patientId={patientId} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDetail;
