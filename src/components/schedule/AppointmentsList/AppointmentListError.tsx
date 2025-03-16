
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type AppointmentListErrorProps = {
  error: Error;
};

const AppointmentListError: React.FC<AppointmentListErrorProps> = ({ error }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading appointments</AlertTitle>
      <AlertDescription>
        {error.message || 'An unexpected error occurred while loading appointments.'}
      </AlertDescription>
    </Alert>
  );
};

export default AppointmentListError;
