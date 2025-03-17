
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';
import { FilePlus2, TestTube, ImagePlus } from 'lucide-react';
import { usePatientData } from '@/hooks/usePatientData';
import { PatientViewProps } from '@/types/patient';
import { useAuth } from '@/context/AuthContext';
import PatientHeader from '../detail/PatientDetailHeader';
import PatientVitalSignsTab from '../tabs/PatientVitalSignsTab';
import PatientLabResultsTab from '../tabs/PatientLabResultsTab';
import PatientImagingTab from '../tabs/PatientImagingTab';
import PatientOrdersTab from '../tabs/PatientOrdersTab';

const TechnicianPatientView: React.FC<PatientViewProps> = ({ patientId }) => {
  const { patient, isLoading, error } = usePatientData(patientId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTechnicianType = user?.role.includes('technician');
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error || !patient) {
    return <div className="p-4 text-red-500">Error loading patient: {error?.toString()}</div>;
  }
  
  return (
    <div className="space-y-6">
      <PatientHeader patient={patient} />
      
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
        
        <Button 
          variant="outline"
          onClick={() => navigate(`/clinical-documentation/new?patientId=${patientId}&type=technical_note`)}
          className="flex items-center"
        >
          <FilePlus2 className="h-4 w-4 mr-2" />
          Technical Note
        </Button>
      </div>
      
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="flex overflow-x-auto pb-px">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          {user?.role === 'lab_technician' && <TabsTrigger value="labs">Lab Results</TabsTrigger>}
          {user?.role === 'radiology_technician' && <TabsTrigger value="imaging">Imaging</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="orders">
          <PatientOrdersTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="vitals">
          <PatientVitalSignsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="labs">
          <PatientLabResultsTab patientId={patientId} />
        </TabsContent>
        
        <TabsContent value="imaging">
          <PatientImagingTab patientId={patientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicianPatientView;
