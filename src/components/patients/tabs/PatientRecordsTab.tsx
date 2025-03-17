
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PatientRecordsTabProps {
  patientId: string;
}

const PatientRecordsTab: React.FC<PatientRecordsTabProps> = ({ patientId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);
  const [records, setRecords] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Simulate loading records
    const loadRecords = async () => {
      try {
        // In a real implementation, you would fetch records from an API
        // For now, let's simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate empty records for now
        setRecords([]);
      } catch (error) {
        console.error('Error loading records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, [patientId]);

  const handleAddRecord = () => {
    navigate(`/clinical-documentation/new?patientId=${patientId}`);
  };

  if (isLoading) {
    return <RecordsLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Medical Records</h3>
        <Button onClick={handleAddRecord}>
          <FilePlus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      {records.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">No medical records found for this patient</p>
            <Button onClick={handleAddRecord} className="mt-4" variant="outline">
              <FilePlus className="h-4 w-4 mr-2" />
              Create First Record
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {records.map(record => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      )}
    </div>
  );
};

// Placeholder component for a record card
const RecordCard: React.FC<{ record: any }> = ({ record }) => (
  <Card>
    <CardHeader>
      <CardTitle>{record.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{record.content}</p>
    </CardContent>
  </Card>
);

const RecordsLoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid gap-4">
      {[1, 2, 3].map(i => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default PatientRecordsTab;
