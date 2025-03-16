
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { usePatientData } from '@/hooks/usePatientData';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { usePatientPrescriptions } from '@/components/patients/hooks/usePatientPrescriptions';
import PatientDetailHeader from '@/components/patients/detail/PatientDetailHeader';
import PatientDetailContent from '@/components/patients/detail/PatientDetailContent';
import PatientDetailLoader from '@/components/patients/detail/PatientDetailLoader';
import { mapToPatientStatus } from '@/types/patientTypes';
import { useSectorContext } from '@/hooks/useSectorContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { language } = useTranslation();
  
  // Get the sector context
  const { selectedSector, assignPatient, unassignPatient } = useSectorContext();
  
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

  // Handle assignment toggle
  const handleAssignmentToggle = async () => {
    if (!patient || !selectedSector) return;
    
    try {
      if (patient.is_assigned) {
        await unassignPatient(patient.id);
        toast.success(language === 'pt' ? 'Paciente desatribuído com sucesso' : 'Patient unassigned successfully');
      } else {
        await assignPatient(patient.id);
        toast.success(language === 'pt' ? 'Paciente atribuído com sucesso' : 'Patient assigned successfully');
      }
    } catch (error) {
      console.error('Error toggling assignment:', error);
      toast.error(
        language === 'pt' ? 'Erro ao atualizar a atribuição' : 'Error updating assignment'
      );
    }
  };
  
  // Loading state
  if (patientLoading) return <PatientDetailLoader />;
  
  // Error state for patient not found
  if (!patient) return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate('/patients')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === 'pt' ? 'Voltar para pacientes' : 'Back to patients'}
            </Button>
            
            <div className="glass-card p-6 text-center">
              <h2 className="text-xl font-bold text-red-500">
                {language === 'pt' ? 'Paciente não encontrado' : 'Patient not found'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {language === 'pt' 
                  ? 'O paciente solicitado não pôde ser encontrado.' 
                  : 'The requested patient could not be found.'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
  
  // Check for critical insights (for the hasCriticalInsights prop)
  const hasCriticalInsights = insights?.some(insight => 
    typeof insight === 'object' && 
    'severity' in insight && 
    insight.severity === 'critical'
  ) || false;
  
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
              onAssignmentToggle={handleAssignmentToggle}
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
