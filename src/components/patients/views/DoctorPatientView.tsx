
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientContext } from '@/context/PatientContext';
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import PatientRecordsTab from '@/components/patients/tabs/PatientRecordsTab';
import PatientPrescriptionsTab from '@/components/patients/tabs/PatientPrescriptionsTab';
import PatientAIInsightsTab from '@/components/patients/tabs/PatientAIInsightsTab';
import AIInsights from '@/components/ai/AIInsights';
import { useTranslation } from '@/hooks/useTranslation';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

const DoctorPatientView: React.FC = () => {
  const { patient, isLoading, error } = usePatientContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get the active tab from URL or default to overview
  const activeTab = searchParams.get('tab') || 'overview';
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    setSearchParams(newParams);
  };
  
  // Filter critical insights
  const criticalInsights = patient?.insights?.filter(insight => 
    insight.type === 'critical' || insight.severity === 'critical'
  ) || [];
  
  const hasCriticalInsights = criticalInsights.length > 0;
  
  if (isLoading) {
    return <div>Loading patient data...</div>;
  }
  
  if (error || !patient) {
    return <div>Error loading patient: {error}</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Display AI critical insights if available */}
      {hasCriticalInsights && (
        <AIInsights 
          insights={criticalInsights}
          className="animate-pulse-subtle"
        />
      )}
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          <TabsTrigger value="records">{t('records')}</TabsTrigger>
          <TabsTrigger value="prescriptions">{t('prescriptions')}</TabsTrigger>
          <TabsTrigger value="ai-insights">{t('aiInsights')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-4">
          <PatientOverviewTab 
            patientId={id || ''}
            insights={patient.insights || []} 
            prescriptions={patient.prescriptions || []} 
          />
        </TabsContent>
        
        <TabsContent value="records" className="space-y-6 mt-4">
          <PatientRecordsTab patientId={id || ''} />
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-6 mt-4">
          <PatientPrescriptionsTab 
            patientId={id || ''} 
            prescriptions={patient.prescriptions || []} 
          />
        </TabsContent>
        
        <TabsContent value="ai-insights" className="space-y-6 mt-4">
          <PatientAIInsightsTab 
            insights={patient.insights || []} 
            loading={false} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorPatientView;
