
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import MedicationCard, { Medication } from './MedicationCard';
import { ChevronRight } from 'lucide-react';

type MedicationsListProps = {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  patientId?: string;
  searchTerm?: string;
  statusFilter?: string;
};

// Sample medications data
const sampleMedications: Medication[] = [
  {
    id: "1",
    patientId: "1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    startDate: "2023-10-15",
    endDate: "2023-12-15",
    status: "active",
    prescribedBy: "Dr. Sarah Chen"
  },
  {
    id: "2",
    patientId: "1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "2023-09-20",
    status: "active",
    prescribedBy: "Dr. Michael Rodriguez"
  },
  {
    id: "3",
    patientId: "2",
    name: "Amoxicillin",
    dosage: "250mg",
    frequency: "Three times daily",
    startDate: "2023-11-05",
    endDate: "2023-11-15",
    status: "discontinued",
    prescribedBy: "Dr. James Wilson"
  },
  {
    id: "4",
    patientId: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    startDate: "2023-08-10",
    status: "active",
    prescribedBy: "Dr. Emily Johnson"
  },
  {
    id: "5",
    patientId: "4",
    name: "Prednisone",
    dosage: "5mg",
    frequency: "Once daily",
    startDate: "2023-11-20",
    endDate: "2023-12-20",
    status: "scheduled",
    prescribedBy: "Dr. Robert Smith"
  },
  {
    id: "6",
    patientId: "5",
    name: "Acetaminophen",
    dosage: "500mg",
    frequency: "As needed",
    startDate: "2023-10-25",
    status: "active",
    prescribedBy: "Dr. Lisa Thompson"
  },
  {
    id: "7",
    patientId: "6",
    name: "Ibuprofen",
    dosage: "400mg",
    frequency: "Every 6 hours",
    startDate: "2023-10-28",
    endDate: "2023-11-05",
    status: "discontinued",
    prescribedBy: "Dr. David Brown"
  }
];

const MedicationsList = ({ 
  className, 
  limit, 
  showViewAll = false, 
  patientId,
  searchTerm = '',
  statusFilter = 'all'
}: MedicationsListProps) => {
  // Filter medications by patientId, searchTerm, and statusFilter
  let filteredMedications = sampleMedications;
  
  if (patientId) {
    filteredMedications = filteredMedications.filter(medication => medication.patientId === patientId);
  }
  
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filteredMedications = filteredMedications.filter(medication => 
      medication.name.toLowerCase().includes(search) || 
      medication.prescribedBy.toLowerCase().includes(search) ||
      medication.dosage.toLowerCase().includes(search)
    );
  }
  
  if (statusFilter && statusFilter !== 'all') {
    filteredMedications = filteredMedications.filter(medication => medication.status === statusFilter);
  }
  
  const medications = limit ? filteredMedications.slice(0, limit) : filteredMedications;
  
  return (
    <div className={cn("space-y-3", className)}>
      {medications.length > 0 ? (
        <>
          {medications.map(medication => (
            <MedicationCard key={medication.id} medication={medication} />
          ))}
          
          {showViewAll && (
            <Link to="/medications" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline py-2">
              View all medications
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No medications found.
        </div>
      )}
    </div>
  );
};

export default MedicationsList;
