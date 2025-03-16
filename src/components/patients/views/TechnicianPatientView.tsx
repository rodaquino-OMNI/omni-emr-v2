
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientContext } from '@/context/PatientContext';
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import PatientRecordsTab from '@/components/patients/tabs/PatientRecordsTab';
import AIInsights from '@/components/ai/AIInsights';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TechnicianPatientViewProps {
  patientId: string;
}

const TechnicianPatientView: React.FC<TechnicianPatientViewProps> = ({ patientId }) => {
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
  
  // Filter technician-relevant insights
  const techInsights = patient?.insights?.filter(insight => 
    insight.type === 'critical' || 
    insight.category === 'lab' ||
    insight.category === 'imaging'
  ) || [];
  
  const hasTechInsights = techInsights.length > 0;
  
  if (isLoading) {
    return <div>Loading patient data...</div>;
  }
  
  if (error || !patient) {
    return <div>Error loading patient: {error}</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Display technician-relevant insights */}
      {hasTechInsights && (
        <AIInsights 
          insights={techInsights}
          className="animate-pulse-subtle"
        />
      )}
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="records">{t('records')}</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default TechnicianPatientView;
