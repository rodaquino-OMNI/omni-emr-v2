
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientContext } from '@/context/PatientContext';
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import PatientRecordsTab from '@/components/patients/tabs/PatientRecordsTab';
import PatientVitalSignsTab from '@/components/patients/tabs/PatientVitalSignsTab';
import AIInsights from '@/components/ai/AIInsights';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface MedicalStaffPatientViewProps {
  patientId: string;
}

const MedicalStaffPatientView: React.FC<MedicalStaffPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatientContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get the active tab from URL or default to overview
  const activeTab = searchParams.get('tab') || 'overview';
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    setSearchParams(newParams);
  };
  
  // Filter relevant medical insights
  const medicalInsights = patient?.insights?.filter(insight => 
    insight.type === 'critical' || 
    insight.severity === 'critical' || 
    insight.category === 'medical' ||
    insight.category === 'diagnosis'
  ) || [];
  
  const hasMedicalInsights = medicalInsights.length > 0;
  
  if (isLoading) {
    return <div>Loading patient data...</div>;
  }
  
  if (error || !patient) {
    return <div>Error loading patient: {error}</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Display medical insights if available */}
      {hasMedicalInsights && (
        <AIInsights 
          insights={medicalInsights}
          className="animate-pulse-subtle"
        />
      )}
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="records">{t('records')}</TabsTrigger>
          <TabsTrigger value="vitalsigns">{t('vitalSigns')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-4">
          <PatientOverviewTab 
            patientId={patientId} 
            insights={patient.insights || []} 
            prescriptions={patient.prescriptions || []} 
          />
        </TabsContent>
        
        <TabsContent value="records" className="space-y-6 mt-4">
          <PatientRecordsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="vitalsigns" className="space-y-6 mt-4">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalStaffPatientView;
