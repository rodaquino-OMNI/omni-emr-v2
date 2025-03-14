
import { useMemo } from 'react';
import { Medication } from '../MedicationCard';

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

export const useMedicationData = (medicationId: string | undefined) => {
  const medication = useMemo(() => {
    return sampleMedications.find(m => m.id === medicationId);
  }, [medicationId]);

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

  return {
    medication,
    formatDate,
    getStatusStyle
  };
};
