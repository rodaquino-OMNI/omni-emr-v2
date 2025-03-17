
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FilePlus2, TestTube, ImagePlus, Activity, Droplet } from 'lucide-react';
import { usePatientData } from '@/hooks/usePatientData';
import { PatientViewProps } from '@/types/patient';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientVitalSignsTab from '../tabs/PatientVitalSignsTab';
import PatientLabResultsTab from '../tabs/PatientLabResultsTab';
import PatientImagingTab from '../tabs/PatientImagingTab';
import PatientOrdersTab from '../tabs/PatientOrdersTab';
import PatientFluidBalanceTab from '../tabs/PatientFluidBalanceTab';
import VitalSignsForm from '@/components/vital-signs/VitalSignsForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MedicationAdministrationRecord from '@/components/medications/administration/MedicationAdministrationRecord';

const TechnicianPatientView: React.FC<PatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatientData(patientId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTechnicianType = user?.role?.includes('technician');
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'orders';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // State for vital signs dialog
  const [vitalsDialogOpen, setVitalsDialogOpen] = useState(false);
  
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

  // Handle vital signs form success
  const handleVitalsSuccess = () => {
    setVitalsDialogOpen(false);
    toast.success("Vital signs recorded successfully");
    // Refresh the vital signs data
    if (activeTab !== 'vitals') {
      setActiveTab('vitals');
    }
  };
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} hasCriticalInsights={false} />
      
      <div className="flex flex-wrap gap-2 mb-4">
        {user?.role === 'lab_technician' && (
          <Button 
            onClick={() => navigate(`/lab/results/new?patientId=${patientId}`)}
            className="flex items-center"
          >
            <TestTube className="h-4 w-4 mr-2" />
            Enter Lab Results
          </Button>
        )}
        
        {user?.role === 'radiology_technician' && (
          <Button 
            onClick={() => navigate(`/imaging/new?patientId=${patientId}`)}
            className="flex items-center"
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload Imaging
          </Button>
        )}

        {/* New buttons for all technician roles */}
        <Button 
          onClick={() => setVitalsDialogOpen(true)}
          className="flex items-center"
          variant="secondary"
        >
          <Activity className="h-4 w-4 mr-2" />
          Record Vital Signs
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/clinical-documentation/new?patientId=${patientId}&type=technical_note`)}
          className="flex items-center"
        >
          <FilePlus2 className="h-4 w-4 mr-2" />
          Technical Note
        </Button>

        <Button
          variant="outline"
          onClick={() => setActiveTab('fluid-balance')}
          className="flex items-center"
        >
          <Droplet className="h-4 w-4 mr-2" />
          Fluid Balance
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-px">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="fluid-balance">Fluid Balance</TabsTrigger>
          {user?.role === 'lab_technician' && <TabsTrigger value="labs">Lab Results</TabsTrigger>}
          {user?.role === 'radiology_technician' && <TabsTrigger value="imaging">Imaging</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="orders">
          <PatientOrdersTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="medications">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-lg font-medium mb-4">Medication Administration</h3>
            <MedicationAdministrationRecord patientId={patientId} />
          </div>
        </TabsContent>

        <TabsContent value="fluid-balance">
          <PatientFluidBalanceTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="labs">
          <PatientLabResultsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="imaging">
          <PatientImagingTab patientId={patientId} />
        </TabsContent>
      </Tabs>

      {/* Vital Signs Dialog */}
      <Dialog open={vitalsDialogOpen} onOpenChange={setVitalsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Vital Signs</DialogTitle>
          </DialogHeader>
          <VitalSignsForm 
            patientId={patientId}
            patientName={`${patient.first_name} ${patient.last_name}`}
            onClose={() => setVitalsDialogOpen(false)}
            onSuccess={handleVitalsSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechnicianPatientView;
