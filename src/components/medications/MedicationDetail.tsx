import React from 'react';
import { useParams } from 'react-router-dom';
import { Pill, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Medication } from './MedicationCard';

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

type MedicationDetailProps = {
  medicationId?: string;
};

const MedicationDetail = ({ medicationId }: MedicationDetailProps) => {
  const params = useParams();
  const id = medicationId || params.id;
  
  const medication = sampleMedications.find(m => m.id === id);
  
  if (!medication) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium text-muted-foreground">Medication not found</h2>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status style
  const getStatusStyle = (status: Medication['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-medical-red/10 flex items-center justify-center">
            <Pill className="h-6 w-6 text-medical-red" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold">{medication.name}</h2>
            <div className="text-sm text-muted-foreground">
              {medication.dosage}
            </div>
          </div>
          
          <div className="ml-auto">
            <span className={cn("px-3 py-1 rounded-full capitalize", getStatusStyle(medication.status))}>
              {medication.status}
            </span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Frequency</h3>
              <p>{medication.frequency}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Start Date</h3>
              <p>{formatDate(medication.startDate)}</p>
            </div>
            
            {medication.endDate && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">End Date</h3>
                <p>{formatDate(medication.endDate)}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Prescribed By</h3>
              <p>{medication.prescribedBy}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Patient ID</h3>
              <p>{medication.patientId}</p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium text-yellow-700">Special Instructions</h4>
              </div>
              <p className="text-sm text-yellow-600">
                Take with food. Avoid alcohol while taking this medication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetail;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
