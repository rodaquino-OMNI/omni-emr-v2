
// Update the import statement in DefaultPatientView to use correct types
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePatientData } from '@/hooks/usePatientData';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useSearchParams } from 'react-router-dom';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientOverviewTab from '../tabs/PatientOverviewTab';
import PatientNotesTab from '../tabs/PatientNotesTab';
import PatientMedicationsTab from '../tabs/PatientMedicationsTab';
import { PatientInsight } from '@/types/patient';

interface DefaultPatientViewProps {
  patientId: string;
}

const DefaultPatientView: React.FC<DefaultPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatientData(patientId);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update URL when tab changes
  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, tab: activeTab });
  }, [activeTab, setSearchParams]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !patient) {
    return <div className="p-4 text-red-500">Error loading patient: {error?.toString()}</div>;
  }
  
  // Check for critical insights
  const hasCriticalInsights = (patient.insights as PatientInsight[] || []).some(
    insight => insight.severity === 'critical'
  );
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} hasCriticalInsights={hasCriticalInsights} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-px">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <PatientOverviewTab patientId={patientId} patient={patient} />
        </TabsContent>
        
        <TabsContent value="medications">
          <PatientMedicationsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="notes">
          <PatientNotesTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DefaultPatientView;
