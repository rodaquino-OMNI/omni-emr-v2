
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { usePatientData } from '@/hooks/usePatientData';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FilePlus2, ActivitySquare, Pill, Droplets } from 'lucide-react';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientVitalSignsTab from '../tabs/PatientVitalSignsTab';
import PatientMedicationsTab from '../tabs/PatientMedicationsTab';
import PatientNotesTab from '../tabs/PatientNotesTab';
import PatientCareTasksTab from '../tabs/PatientCareTasksTab';
import PatientFluidBalanceTab from '../tabs/PatientFluidBalanceTab';

interface NursePatientViewProps {
  patientId: string;
}

const NursePatientView: React.FC<NursePatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatientData(patientId);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'vitals';
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
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} hasCriticalInsights={false} />
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={() => navigate(`/patients/${patientId}/vitals/new`)}
          className="flex items-center"
        >
          <ActivitySquare className="h-4 w-4 mr-2" />
          Record Vitals
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/clinical-documentation/new?patientId=${patientId}&type=nursing_note`)}
          className="flex items-center"
        >
          <FilePlus2 className="h-4 w-4 mr-2" />
          Nursing Note
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/medications/administer?patientId=${patientId}`)}
          className="flex items-center"
        >
          <Pill className="h-4 w-4 mr-2" />
          Administer Medication
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/patients/${patientId}/fluid-balance`)}
          className="flex items-center"
        >
          <Droplets className="h-4 w-4 mr-2" />
          Fluid Balance
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-px">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="tasks">Care Tasks</TabsTrigger>
          <TabsTrigger value="fluid-balance">Fluid Balance</TabsTrigger>
          <TabsTrigger value="notes">Nursing Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="medications">
          <PatientMedicationsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="tasks">
          <PatientCareTasksTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="fluid-balance">
          <PatientFluidBalanceTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="notes">
          <PatientNotesTab patientId={patientId} filter="nursing_note" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NursePatientView;
