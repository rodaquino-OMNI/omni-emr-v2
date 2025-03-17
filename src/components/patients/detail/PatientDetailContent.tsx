
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PatientOverviewTab,
  PatientRecordsTab,
  PatientPrescriptionsTab,
  PatientAIInsightsTab
} from '@/components/patients/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { Patient } from '@/types/patient';
import { adaptToComponentAIInsight } from '@/utils/typeAdapters';

interface PatientDetailContentProps {
  patient: Patient;
  patientId: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const PatientDetailContent: React.FC<PatientDetailContentProps> = ({
  patient,
  patientId,
  activeTab = 'overview',
  onTabChange
}) => {
  const { t } = useTranslation();

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  // Ensure patient has insights array and convert them to the format expected by PatientAIInsightsTab
  const patientInsights = patient.insights || [];

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
        <TabsTrigger value="records">{t('records')}</TabsTrigger>
        <TabsTrigger value="prescriptions">{t('prescriptions')}</TabsTrigger>
        <TabsTrigger value="ai_insights">{t('aiInsights')}</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <PatientOverviewTab patientId={patientId} patient={patient} />
      </TabsContent>
      <TabsContent value="records">
        <PatientRecordsTab patientId={patientId} />
      </TabsContent>
      <TabsContent value="prescriptions">
        <PatientPrescriptionsTab patientId={patientId} />
      </TabsContent>
      <TabsContent value="ai_insights">
        <PatientAIInsightsTab 
          patientId={patientId} 
          insights={patientInsights}
          isLoading={false}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PatientDetailContent;
