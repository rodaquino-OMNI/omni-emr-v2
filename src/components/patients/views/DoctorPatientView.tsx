
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { usePatientData } from '@/hooks/usePatientData';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, Pill, ClipboardList, FileText } from 'lucide-react';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientOverviewTab from '../tabs/PatientOverviewTab';
import PatientNotesTab from '../tabs/PatientNotesTab';
import PatientMedicationsTab from '../tabs/PatientMedicationsTab';
import PatientVitalSignsTab from '../tabs/PatientVitalSignsTab';
import PatientAIInsightsTab from '../tabs/PatientAIInsightsTab';
import { useAuth } from '@/context/AuthContext';

interface DoctorPatientViewProps {
  patientId: string;
}

const DoctorPatientView: React.FC<DoctorPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading: patientLoading, error: patientError } = usePatientData(patientId);
  const { insights, isLoading: insightsLoading, error: insightsError } = usePatientInsights(patientId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (patientLoading) {
    return <LoadingSpinner />;
  }
  
  if (patientError || !patient) {
    return <div className="p-4 text-red-500">Error loading patient: {patientError?.toString()}</div>;
  }

  // Ensure patient has the insights array
  const patientWithInsights = {
    ...patient,
    insights: insights || []
  };
  
  const handleGenerateInsight = () => {
    console.log('Generate insight for patient:', patientId);
    // Navigate to insight generation page or open modal
  };
  
  const handleRefreshInsights = () => {
    console.log('Refresh insights for patient:', patientId);
    // Add refresh logic
  };
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patientWithInsights} />
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={() => navigate(`/prescribe?patientId=${patientId}`)}
          className="flex items-center"
        >
          <Pill className="h-4 w-4 mr-2" />
          Prescribe Medication
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/clinical-documentation/new?patientId=${patientId}&type=progress_note`)}
          className="flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Progress Note
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/patients/${patientId}/vitals/new`)}
          className="flex items-center"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          Record Vitals
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/orders/new?patientId=${patientId}`)}
          className="flex items-center"
        >
          <FilePlus2 className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-px">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="ai_insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <PatientOverviewTab patientId={patientId} patient={patientWithInsights} />
        </TabsContent>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="medications">
          <PatientMedicationsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="notes">
          <PatientNotesTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="ai_insights">
          <PatientAIInsightsTab 
            patientId={patientId} 
            insights={patientWithInsights.insights || []}
            isLoading={insightsLoading}
            onRefresh={handleRefreshInsights}
            onGenerateInsight={handleGenerateInsight}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorPatientView;
