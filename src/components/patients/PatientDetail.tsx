
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIInsights from '../ai/AIInsights';
import { useAIInsights } from '@/hooks/useAIInsights';
import { samplePatients } from '../../data/samplePatients';
import PatientHeader from './PatientHeader';
import PatientOverviewTab from './tabs/PatientOverviewTab';
import PatientRecordsTab from './tabs/PatientRecordsTab';
import PatientPrescriptionsTab from './tabs/PatientPrescriptionsTab';
import PatientAIInsightsTab from './tabs/PatientAIInsightsTab';
import { usePatientPrescriptions } from './hooks/usePatientPrescriptions';

type PatientDetailProps = {
  patientId: string;
  className?: string;
};

const PatientDetail = ({ patientId, className }: PatientDetailProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const patient = samplePatients.find(p => p.id === patientId);
  
  const { insights, loading: insightsLoading } = useAIInsights(
    patientId, 
    ['vitals', 'labs', 'medications', 'tasks', 'general']
  );
  
  const { prescriptions, loading: prescriptionsLoading } = usePatientPrescriptions(patientId);
  
  if (!patient) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium text-muted-foreground">Patient not found</h2>
      </div>
    );
  }

  const criticalInsights = insights.filter(insight => insight.type === 'critical');
  const hasCriticalInsights = criticalInsights.length > 0;

  return (
    <div className={cn("space-y-6", className)}>
      <PatientHeader 
        patient={patient} 
        hasCriticalInsights={hasCriticalInsights} 
      />
      
      {hasCriticalInsights && (
        <AIInsights 
          insights={criticalInsights}
          className="animate-pulse-subtle"
        />
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="records">Records</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <PatientOverviewTab 
            patientId={patientId} 
            insights={insights} 
            prescriptions={prescriptions} 
          />
        </TabsContent>
        
        <TabsContent value="records" className="space-y-6">
          <PatientRecordsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-6">
          <PatientPrescriptionsTab 
            patientId={patientId} 
            prescriptions={prescriptions} 
            loading={prescriptionsLoading} 
          />
        </TabsContent>
        
        <TabsContent value="ai-insights" className="space-y-6">
          <PatientAIInsightsTab 
            insights={insights} 
            loading={insightsLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
