
import React from 'react';
import { Link } from 'react-router-dom';
import { PrescriptionsList } from '../prescriptions';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PatientPrescriptionsProps = {
  patientId: string;
  prescriptions: any[];
  loading: boolean;
};

const PatientPrescriptions = ({ patientId, prescriptions, loading }: PatientPrescriptionsProps) => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Prescriptions</h2>
        
        <Link to={`/prescribe/${patientId}`}>
          <Button size="sm" className="flex items-center gap-1">
            <ClipboardList className="h-4 w-4" />
            New Prescription
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">Loading prescriptions...</p>
        </div>
      ) : (
        <PrescriptionsList 
          prescriptions={prescriptions}
          patientId={patientId}
          showAddNew={false}
        />
      )}
    </div>
  );
};

export default PatientPrescriptions;
