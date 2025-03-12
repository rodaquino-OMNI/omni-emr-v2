
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import PatientCard, { Patient } from './PatientCard';
import { ChevronRight } from 'lucide-react';

type PatientListProps = {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
};

// Sample patient data
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    age: 65,
    gender: "Male",
    roomNumber: "203",
    status: "hospital",
    diagnosis: "Post-op recovery"
  },
  {
    id: "2",
    name: "Emma Thompson",
    age: 72,
    gender: "Female",
    status: "critical",
    roomNumber: "ICU-5",
    diagnosis: "Pneumonia"
  },
  {
    id: "3",
    name: "Michael Johnson",
    age: 58,
    gender: "Male",
    status: "home",
    diagnosis: "Chronic heart failure"
  },
  {
    id: "4",
    name: "Sophia Martinez",
    age: 45,
    gender: "Female",
    roomNumber: "105",
    status: "improving",
    diagnosis: "Diabetes management"
  },
  {
    id: "5",
    name: "Robert Chen",
    age: 68,
    gender: "Male",
    status: "stable",
    roomNumber: "218",
    diagnosis: "Hip replacement"
  },
  {
    id: "6",
    name: "Olivia Wilson",
    age: 83,
    gender: "Female",
    status: "home",
    diagnosis: "Rehabilitation"
  },
  {
    id: "7",
    name: "William Davis",
    age: 71,
    gender: "Male",
    status: "discharged",
    diagnosis: "Recovered"
  }
];

const PatientList = ({ className, limit, showViewAll = false }: PatientListProps) => {
  const patients = limit ? samplePatients.slice(0, limit) : samplePatients;
  
  return (
    <div className={cn("space-y-3", className)}>
      {patients.map(patient => (
        <PatientCard key={patient.id} patient={patient} />
      ))}
      
      {showViewAll && (
        <Link to="/patients" className="flex items-center justify-center gap-1 text-sm text-primary hover:underline py-2">
          View all patients
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
};

export default PatientList;
