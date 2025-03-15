
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import PrescriptionCard from './PrescriptionCard';
import EmptyPrescriptionsState from './EmptyPrescriptionsState';
import { ChevronRight, PlusCircle, FileText } from 'lucide-react';
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
    <div className={cn("space-y-4", className)}>
      {patientId && showAddNew && isDoctor && (
        <div className="flex justify-end">
          <Link to={`/prescribe/${patientId}`}>
            <Button size="sm" className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              New Prescription
            </Button>
          </Link>
        </div>
      )}
      
      {displayedPrescriptions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {displayedPrescriptions.map(prescription => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
          
          {showViewAll && filteredPrescriptions.length > limit! && (
            <div className="flex justify-end mt-2">
              <Link to={patientId ? `/prescriptions?patientId=${patientId}` : "/prescriptions"} 
                    className="flex items-center gap-1 text-sm text-primary hover:underline py-2">
                <FileText className="h-4 w-4" />
                View all prescriptions
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </>
      ) : (
        <EmptyPrescriptionsState patientId={patientId} />
      )}
      
      {!patientId && showAddNew && isDoctor && (
        <div className="flex justify-end mt-4">
          <Link to="/prescribe">
            <Button className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              New Prescription
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsList;
