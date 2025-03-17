import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { usePrescriptionDetails } from '@/hooks/usePrescriptionDetails';
import { ErrorMessage } from '@/components/ui/error-message';
import { Spinner } from '@/components/ui/spinner';

const PrescriptionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { prescription, loading, error } = usePrescriptionDetails(id);

  if (loading) {
    return <div className="flex justify-center p-12"><Spinner /></div>;
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Error Loading Prescription" 
        message={error}
      />
    );
  }

  if (!prescription) {
    return (
      <ErrorMessage 
        title="Prescription Not Found" 
        message="The requested prescription could not be found."
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        {/* Prescription details would go here */}
        <pre>{JSON.stringify(prescription, null, 2)}</pre>
      </Card>
    </div>
  );
};

export default PrescriptionView;
