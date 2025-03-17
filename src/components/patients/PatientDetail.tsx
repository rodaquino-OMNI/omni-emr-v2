
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
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { adaptInsightsForPatientDetail } from './utils/patientDetailAdapter';

type PatientDetailProps = {
  patientId: string;
  className?: string;
};

const PatientDetail = ({ patientId, className }: PatientDetailProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const permissions = usePermissions(user);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const patient = samplePatients.find(p => p.id === patientId);
  
  const { insights: componentInsights, isLoading } = useAIInsights(
    patientId, 
    ['vitals', 'labs', 'medications', 'tasks', 'general']
  );
  
  // Convert component insights to PatientAIInsight format
  const insights = adaptInsightsForPatientDetail(componentInsights);
  
  const { prescriptions, loading: prescriptionsLoading } = usePatientPrescriptions(patientId);
  
  // Check permissions for each tab
  const canViewRecords = permissions.hasPermission('view_records');
  const canViewPrescriptions = permissions.hasPermission('view_medications');
  const canViewAIInsights = permissions.hasPermission('view_analytics');
  
  if (!patient) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium text-muted-foreground">{t('patientNotFound')}</h2>
      </div>
    );
  }

  const criticalInsights = componentInsights.filter(insight => insight.type === 'critical');
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
          <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
          {canViewRecords && <TabsTrigger value="records">{t('records')}</TabsTrigger>}
          {canViewPrescriptions && <TabsTrigger value="prescriptions">{t('prescriptions')}</TabsTrigger>}
          {canViewAIInsights && <TabsTrigger value="ai-insights">{t('aiInsights')}</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <PatientOverviewTab 
            patientId={patientId} 
            insights={insights} 
            prescriptions={prescriptions} 
          />
        </TabsContent>
        
        {canViewRecords && (
          <TabsContent value="records" className="space-y-6">
            <PatientRecordsTab patientId={patientId} />
          </TabsContent>
        )}
        
        {canViewPrescriptions && (
          <TabsContent value="prescriptions" className="space-y-6">
            <PatientPrescriptionsTab 
              patientId={patientId} 
              prescriptions={prescriptions} 
              loading={prescriptionsLoading} 
            />
          </TabsContent>
        )}
        
        {canViewAIInsights && (
          <TabsContent value="ai-insights" className="space-y-6">
            <PatientAIInsightsTab 
              insights={insights} 
              isLoading={isLoading} 
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PatientDetail;
