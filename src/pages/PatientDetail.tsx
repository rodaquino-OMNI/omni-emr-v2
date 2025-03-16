
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { usePatientData } from '@/hooks/usePatientData';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { usePatientPrescriptions } from '@/components/patients/hooks/usePatientPrescriptions';
import PatientDetailHeader from '@/components/patients/detail/PatientDetailHeader';
import PatientDetailContent from '@/components/patients/detail/PatientDetailContent';
import PatientDetailLoader from '@/components/patients/detail/PatientDetailLoader';
import { mapToPatientStatus } from '@/types/patientTypes';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Get the patient ID from params
  const patientId = id || '';
  
  // Fetch patient data using our custom hook
  const { patient, isLoading: patientLoading } = usePatientData(patientId);
  
  // Fetch insights data
  const { data: insights, isLoading: insightsLoading } = usePatientInsights(patientId);
  
  // Fetch prescriptions data
  const { prescriptions, loading: prescriptionsLoading } = usePatientPrescriptions(patientId);
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Loading state
  if (patientLoading) return <PatientDetailLoader />;
  
  // Error state for patient not found
  if (!patient) return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-bold text-red-500">Patient not found</h2>
      <p className="mt-2 text-gray-600">The requested patient could not be found.</p>
    </div>
  );
  
  // Check for critical insights (for the hasCriticalInsights prop)
  const hasCriticalInsights = false; // Default value, would be computed from insights data
  
  // Ensure patient has the correct status type
  const patientWithValidStatus = {
    ...patient,
    status: mapToPatientStatus(patient.status?.toString() || 'stable')
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="space-y-4">
            {/* Patient header with back button */}
            <PatientDetailHeader
              patient={patientWithValidStatus}
              hasCriticalInsights={hasCriticalInsights}
            />
            
            {/* Main content with tabs */}
            <PatientDetailContent
              patientId={patientId}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              insights={insights || []}
              insightsLoading={insightsLoading}
              prescriptions={prescriptions || []}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDetail;
