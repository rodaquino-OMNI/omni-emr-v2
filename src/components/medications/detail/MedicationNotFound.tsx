
import React from 'react';
import { Link } from 'react-router-dom';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MedicationNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <FileX className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-2">Medication Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        The medication you're looking for doesn't exist or you may not have permission to view it.
      </p>
      <Button asChild>
        <Link to="/medications">Back to Medications</Link>
      </Button>
    </div>
  );
};

export default MedicationNotFound;
