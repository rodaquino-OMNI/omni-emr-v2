
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIInsights from '../ai/AIInsights';
import { useAIInsights } from '@/hooks/useAIInsights';
import { getPatientPrescriptions } from '../../services/prescriptionService';
import { samplePatients } from '../../data/samplePatients';
import PatientHeader from './PatientHeader';
import PatientOverview from './PatientOverview';
import PatientRecords from './PatientRecords';
import PatientPrescriptions from './PatientPrescriptions';
import PatientAIInsights from './PatientAIInsights';

type PatientDetailProps = {
  patientId: string;
  className?: string;
};

const PatientDetail = ({ patientId, className }: PatientDetailProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const patient = samplePatients.find(p => p.id === patientId);
  
  const { insights, loading: insightsLoading } = useAIInsights(
    patientId, 
    ['vitals', 'labs', 'medications', 'tasks', 'general']
  );
  
  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      try {
        const data = await getPatientPrescriptions(patientId);
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescriptions();
  }, [patientId]);
  
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
          <PatientOverview 
            patientId={patientId} 
            insights={insights} 
            prescriptions={prescriptions} 
          />
        </TabsContent>
        
        <TabsContent value="records" className="space-y-6">
          <PatientRecords patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="prescriptions" className="space-y-6">
          <PatientPrescriptions 
            patientId={patientId} 
            prescriptions={prescriptions} 
            loading={loading} 
          />
        </TabsContent>
        
        <TabsContent value="ai-insights" className="space-y-6">
          <PatientAIInsights 
            insights={insights} 
            loading={insightsLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
