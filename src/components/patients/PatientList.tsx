
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusBadge from '../ui/StatusBadge';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PatientStatus } from '@/types/patientTypes';

type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  room?: string;
  status: PatientStatus;
  lastVisit?: string;
  nextAppointment?: string;
  image?: string;
};

type PatientListProps = {
  patients?: Patient[];
  limit?: number;
  showViewAll?: boolean;
  className?: string;
  statusFilter?: string;
  searchTerm?: string;
};

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    age: 62,
    gender: "male",
    room: "402",
    status: "hospital",
    lastVisit: "2023-11-15",
    nextAppointment: "2023-12-20",
    image: "https://images.unsplash.com/photo-1575936123452-d666ca386bbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bWVufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "2",
    name: "Emily Johnson",
    age: 34,
    gender: "female",
    status: "home",
    lastVisit: "2023-11-10",
    nextAppointment: "2023-12-10",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8d29tYW58ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "3",
    name: "Michael Davis",
    age: 78,
    gender: "male",
    room: "ICU",
    status: "critical",
    lastVisit: "2023-11-20",
    nextAppointment: "2024-01-05",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bWVufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "4",
    name: "Jessica Wilson",
    age: 29,
    gender: "female",
    status: "stable",
    lastVisit: "2023-11-22",
    nextAppointment: "2023-12-22",
    image: "https://images.unsplash.com/photo-1503185918233-194c7ddfa38f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHdvdW1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "5",
    name: "David Garcia",
    age: 45,
    gender: "male",
    status: "improving",
    lastVisit: "2023-11-18",
    nextAppointment: "2023-12-18",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd8b401e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fG1lbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "6",
    name: "Linda Rodriguez",
    age: 51,
    gender: "female",
    status: "discharged",
    lastVisit: "2023-11-01",
    nextAppointment: "2024-01-10",
    image: "https://images.unsplash.com/photo-1544005313-943cb025c0e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHdvdW1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
  },
];

const PatientList = ({ limit, showViewAll, className, statusFilter = 'all', searchTerm = '' }: PatientListProps) => {
  const { language } = useTranslation();
  
  // Filter patients based on status and search term
  const filteredPatients = mockPatients.filter(patient => {
    // Filter by status
    if (statusFilter !== 'all' && patient.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term (case insensitive)
    if (searchTerm && !patient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Limit the number of patients shown
  const patients = limit ? filteredPatients.slice(0, limit) : filteredPatients;
  
  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          {language === 'pt' ? 'Nenhum paciente encontrado' : 'No patients found'}
        </p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="divide-y divide-border">
        {patients.map((patient) => (
          <Link 
            key={patient.id} 
            to={`/patients/${patient.id}`} 
            className="block py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-md px-2 -mx-2"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={patient.image} alt={patient.name} />
                <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">{patient.name}</div>
                <div className="text-sm text-muted-foreground">
                  {patient.age} {language === 'pt' ? 'anos' : 'yrs'}, {patient.gender === 'male' ? (language === 'pt' ? 'Masculino' : 'Male') : (language === 'pt' ? 'Feminino' : 'Female')}
                  {patient.room && <>, {language === 'pt' ? 'Quarto' : 'Room'} {patient.room}</>}
                  {patient.room && patient.room === 'ICU' && <>, {language === 'pt' ? 'UTI' : 'ICU'}</>}
                </div>
              </div>
              
              <StatusBadge status={patient.status} />
            </div>
          </Link>
        ))}
      </div>
      
      {showViewAll && patients.length > 0 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" asChild>
            <Link 
              to="/patients" 
              className="inline-flex items-center gap-1"
            >
              {language === 'pt' ? 'Ver todos os pacientes' : 'View all patients'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientList;
