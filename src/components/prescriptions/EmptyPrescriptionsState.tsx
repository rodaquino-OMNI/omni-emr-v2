
import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

type EmptyPrescriptionsStateProps = {
  patientId?: string;
};

const EmptyPrescriptionsState: React.FC<EmptyPrescriptionsStateProps> = ({ patientId }) => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor' || user?.role === 'admin';

  return (
    <div className="text-center py-8 px-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <ClipboardList className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Prescriptions Found</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {patientId 
          ? "This patient doesn't have any prescriptions yet." 
          : "There are no prescriptions in the system yet."}
      </p>
      
      {isDoctor && patientId && (
        <Link to={`/prescribe/${patientId}`}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Prescription
          </Button>
        </Link>
      )}
      
      {isDoctor && !patientId && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-2">To create a prescription:</p>
          <ol className="text-sm text-left max-w-md mx-auto space-y-2">
            <li>1. Navigate to a patient's profile</li>
            <li>2. Click on the "New Prescription" button</li>
            <li>3. Fill in the prescription details</li>
          </ol>
          <div className="mt-4">
            <Link to="/patients">
              <Button variant="outline" className="flex items-center gap-2">
                View Patients
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmptyPrescriptionsState;
