
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { usePatientData } from '@/hooks/usePatientData';
import { usePatientInsights } from '@/hooks/usePatientInsights';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FilePlus2, Pill, ClipboardList, FileText } from 'lucide-react';
import PatientHeader from '../detail/PatientDetailHeader';
import {
  PatientOverviewTab,
  PatientNotesTab,
  PatientVitalSignsTab,
  PatientAIInsightsTab,
  PatientPrescriptionsTab,
  PatientCareTasksTab,
  PatientAppointmentsTab
} from '../tabs';
import EnhancedPatientMedicationsTab from '../tabs/EnhancedPatientMedicationsTab';
import { useAuth } from '@/context/AuthContext';
import { Patient, PatientInsight } from '@/types/patient';

interface DoctorPatientViewProps {
  patientId: string;
}

const DoctorPatientView: React.FC<DoctorPatientViewProps> = ({ patientId }) => {
  const { patient, isLoading: patientLoading, error: patientError } = usePatientData(patientId);
  const { insights, isLoading: insightsLoading, error: insightsError } = usePatientInsights(patientId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Update URL when tab changes
  useEffect(() => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, tab: activeTab });
  }, [activeTab, setSearchParams]);
  
  if (patientLoading) {
    return <LoadingSpinner />;
  }
  
  if (patientError || !patient) {
    return <div className="p-4 text-red-500">Error loading patient: {patientError?.toString()}</div>;
  }

  // Ensure patient has the insights array and convert category to a valid type
  const adaptedInsights = insights ? insights.map(insight => ({
    ...insight,
    patient_id: insight.patientId,
    // Map category to an acceptable union type
    category: (insight.category === 'lab' || insight.category === 'medications' || 
              insight.category === 'vitals' || insight.category === 'diagnosis') 
              ? 'info' 
              : (insight.severity === 'critical' ? 'critical' : 
                 insight.severity === 'warning' ? 'warning' : 'info') as PatientInsight['category']
  })) : [];
  
  // Create a typed patient object with the adapted insights
  const patientWithDetails = {
    ...patient,
    insights: adaptedInsights
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
      <PatientHeader 
        patient={patient} 
        hasCriticalInsights={adaptedInsights.some(insight => insight.severity === 'critical')}
      />
      
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
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="ai_insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <PatientOverviewTab patientId={patientId} patient={patientWithDetails} />
        </TabsContent>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="medications">
          <EnhancedPatientMedicationsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="prescriptions">
          <PatientPrescriptionsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="tasks">
          <PatientCareTasksTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="appointments">
          <PatientAppointmentsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="notes">
          <PatientNotesTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="ai_insights">
          <PatientAIInsightsTab
            patientId={patientId}
            insights={adaptedInsights}
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
