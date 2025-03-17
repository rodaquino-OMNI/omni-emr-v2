
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Pill, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface PatientPrescriptionsTabProps {
  patientId: string;
}

const PatientPrescriptionsTab: React.FC<PatientPrescriptionsTabProps> = ({ patientId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [prescriptions, setPrescriptions] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Simulate loading prescriptions
    const loadPrescriptions = async () => {
      try {
        // In a real implementation, you would fetch prescriptions from an API
        // For now, let's simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate empty prescriptions for now
        setPrescriptions([]);
      } catch (error) {
        console.error('Error loading prescriptions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrescriptions();
  }, [patientId]);

  const handleAddPrescription = () => {
    navigate(`/prescribe?patientId=${patientId}`);
  };

  if (isLoading) {
    return <PrescriptionsLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prescriptions</h3>
        <Button onClick={handleAddPrescription}>
          <Plus className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 text-center">
            <Pill className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">No prescriptions found for this patient</p>
            <Button onClick={handleAddPrescription} className="mt-4" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New Prescription
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map(prescription => (
            <PrescriptionCard key={prescription.id} prescription={prescription} />
          ))}
        </div>
      )}
    </div>
  );
};

// Placeholder component for a prescription card
const PrescriptionCard: React.FC<{ prescription: any }> = ({ prescription }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-md">{prescription.medication}</CardTitle>
        <Badge 
          variant={
            prescription.status === 'active' ? 'default' : 
            prescription.status === 'completed' ? 'outline' : 
            'secondary'
          }
        >
          {prescription.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-2">
        {prescription.dosage}, {prescription.frequency}, {prescription.duration}
      </p>
      {prescription.instructions && (
        <p className="text-sm mt-2">
          <span className="font-medium">Instructions:</span> {prescription.instructions}
        </p>
      )}
      <div className="text-xs text-muted-foreground mt-2">
        Prescribed on: {new Date(prescription.created_at).toLocaleDateString()}
      </div>
    </CardContent>
  </Card>
);

const PrescriptionsLoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-48" />
    </div>
    <div className="grid gap-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-32 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PatientPrescriptionsTab;
