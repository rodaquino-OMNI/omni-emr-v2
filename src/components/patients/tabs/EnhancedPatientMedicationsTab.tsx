import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PatientTabProps } from '@/types/patient';
import { usePatientPrescriptions } from '@/hooks/usePatientPrescriptions';
import { Pill, FileEdit, ClipboardList, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface EnhancedPatientMedicationsTabProps extends PatientTabProps {
  compact?: boolean;
}

const EnhancedPatientMedicationsTab: React.FC<EnhancedPatientMedicationsTabProps> = ({ patientId, compact = false }) => {
  const { data: prescriptions, isLoading, error } = usePatientPrescriptions(patientId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-red-600">
            Error loading medications: {error.toString()}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Filter medications from prescriptions based on status
  const activeMedications = prescriptions?.flatMap(prescription => 
    prescription.items?.filter(item => 
      item.type === 'medication' && item.status !== 'cancelled' && item.status !== 'completed'
    ) || []
  ) || [];
  
  const completedMedications = prescriptions?.flatMap(prescription => 
    prescription.items?.filter(item => 
      item.type === 'medication' && item.status === 'completed'
    ) || []
  ) || [];
  
  const cancelledMedications = prescriptions?.flatMap(prescription => 
    prescription.items?.filter(item => 
      item.type === 'medication' && item.status === 'cancelled'
    ) || []
  ) || [];
  
  const handlePrescribe = () => {
    navigate(`/prescribe-medication?patientId=${patientId}`);
  };
  
  const handleViewPrescriptions = () => {
    navigate(`/prescriptions?patientId=${patientId}`);
  };
  
  const handleViewMedication = (medicationId: string) => {
    navigate(`/medications/${medicationId}`);
  };
  
  const renderMedicationList = (medications: any[]) => {
    if (medications.length === 0) {
      return (
        <div className="text-muted-foreground flex items-center gap-2 p-4">
          <Pill className="h-4 w-4" />
          No medications in this category.
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {medications.map((medication) => (
          <div 
            key={medication.id} 
            className="border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded cursor-pointer"
            onClick={() => handleViewMedication(medication.id)}
          >
            <div className="flex justify-between items-start">
              <div className="font-medium">{medication.name}</div>
              <Badge variant={medication.status === 'active' ? 'default' : 'outline'}>
                {medication.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {medication.dosage && <span>{medication.dosage}</span>}
              {medication.frequency && <span> • {medication.frequency}</span>}
              {medication.duration && <span> • for {medication.duration}</span>}
            </div>
            {medication.instructions && (
              <div className="text-sm mt-1">{medication.instructions}</div>
            )}
            {medication.start_date && (
              <div className="text-xs text-muted-foreground mt-2">
                Started: {format(new Date(medication.start_date), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={handlePrescribe}
          className="flex items-center"
        >
          <FileEdit className="h-4 w-4 mr-2" />
          Prescribe Medication
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleViewPrescriptions}
          className="flex items-center"
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          View Prescriptions
        </Button>
      </div>
      
      <Card>
        <CardHeader className={compact ? "pb-2" : "pb-4"}>
          <CardTitle className={compact ? "text-base" : "text-lg"}>Medications</CardTitle>
          <CardDescription>
            Manage patient medications and prescriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="active" className="flex items-center">
                <Pill className="h-4 w-4 mr-2" />
                Active
                {activeMedications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{activeMedications.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                {completedMedications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{completedMedications.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled
                {cancelledMedications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{cancelledMedications.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {renderMedicationList(activeMedications)}
            </TabsContent>
            
            <TabsContent value="completed">
              {renderMedicationList(completedMedications)}
            </TabsContent>
            
            <TabsContent value="cancelled">
              {renderMedicationList(cancelledMedications)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {prescriptions && prescriptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={compact ? "text-base" : "text-lg"}>Recent Prescriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prescriptions.slice(0, 3).map((prescription) => (
                <div 
                  key={prescription.id} 
                  className="border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/50 p-2 rounded cursor-pointer"
                  onClick={() => navigate(`/prescriptions/${prescription.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-medium">
                      Prescription #{prescription.id.substring(0, 8)}
                    </div>
                    <Badge variant={prescription.status === 'active' ? 'default' : 'outline'}>
                      {prescription.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {prescription.items?.length || 0} medication(s)
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Created: {format(new Date(prescription.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
              ))}
              
              {prescriptions.length > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-sm" 
                  onClick={handleViewPrescriptions}
                >
                  View all prescriptions
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedPatientMedicationsTab;