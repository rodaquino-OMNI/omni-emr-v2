
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import PrescriptionCard from './PrescriptionCard';
import EmptyPrescriptionsState from './EmptyPrescriptionsState';
import { ChevronRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PrescriptionsListProps = {
  prescriptions: any[];
  patientId?: string;
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  showAddNew?: boolean;
};

const PrescriptionsList = ({ 
  prescriptions, 
  patientId,
  className, 
  limit, 
  showViewAll = false,
  showAddNew = false
}: PrescriptionsListProps) => {
  const { user } = useAuth();
  const isDoctor = user?.role === 'doctor' || user?.role === 'admin';
  
  // Filter prescriptions by patientId if provided - works with both FHIR data structure and legacy data
  const filteredPrescriptions = patientId 
    ? prescriptions.filter(prescription => 
        // FHIR structure uses subject_id, legacy uses patientId
        (prescription.subject_id === patientId || prescription.patientId === patientId)
      )
    : prescriptions;
  
  const displayedPrescriptions = limit ? filteredPrescriptions.slice(0, limit) : filteredPrescriptions;
  
  return (
    <div className={cn("space-y-3", className)}>
      {displayedPrescriptions.length > 0 ? (
        <>
          {displayedPrescriptions.map(prescription => (
            <PrescriptionCard key={prescription.id} prescription={prescription} />
          ))}
          
          <div className="flex justify-between items-center">
            {showViewAll && (
              <Link to="/prescriptions" className="flex items-center gap-1 text-sm text-primary hover:underline py-2">
                View all prescriptions
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
            
            {showAddNew && isDoctor && patientId && (
              <Link to={`/prescribe/${patientId}`}>
                <Button size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Prescription
                </Button>
              </Link>
            )}
          </div>
        </>
      ) : (
        <EmptyPrescriptionsState patientId={patientId} />
      )}
    </div>
  );
};

export default PrescriptionsList;
