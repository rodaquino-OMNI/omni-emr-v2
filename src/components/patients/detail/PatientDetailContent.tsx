
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientOverviewTab from '@/components/patients/tabs/PatientOverviewTab';
import PatientRecordsTab from '@/components/patients/tabs/PatientRecordsTab';
import PatientPrescriptionsTab from '@/components/patients/tabs/PatientPrescriptionsTab';
import PatientAIInsightsTab from '@/components/patients/tabs/PatientAIInsightsTab';

interface PatientDetailContentProps {
  patientId: string;
  activeTab: string;
  onTabChange: (value: string) => void;
  insights: any[];
  insightsLoading: boolean;
  prescriptions: any[];
}

const PatientDetailContent = ({ 
  patientId, 
  activeTab, 
  onTabChange,
  insights,
  insightsLoading,
  prescriptions
}: PatientDetailContentProps) => {
  return (
    <Tabs 
      defaultValue="overview" 
      value={activeTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="records">Medical Records</TabsTrigger>
        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-2">
        <PatientOverviewTab 
          patientId={patientId} 
          insights={insights || []} 
          prescriptions={prescriptions || []} 
        />
      </TabsContent>
      
      <TabsContent value="records" className="space-y-2">
        <PatientRecordsTab patientId={patientId} />
      </TabsContent>
      
      <TabsContent value="prescriptions" className="space-y-2">
        <PatientPrescriptionsTab 
          patientId={patientId} 
          prescriptions={prescriptions || []} 
        />
      </TabsContent>
      
      <TabsContent value="ai-insights" className="space-y-2">
        <PatientAIInsightsTab 
          insights={insights || []} 
          loading={insightsLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default PatientDetailContent;
