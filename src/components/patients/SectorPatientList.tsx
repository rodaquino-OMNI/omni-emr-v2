
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectorPatient } from '@/types/sector';
import { useTranslation } from '@/hooks/useTranslation';
import { User, UserPlus, UserMinus, ArrowRight, AlertTriangle } from 'lucide-react';
import { useSectorContext } from '@/hooks/useSectorContext';
import StatusBadge from '@/components/ui/StatusBadge';
import TranslatedText from '@/components/common/TranslatedText';
import PatientCard from '@/components/patients/PatientCard';

type SectorPatientListProps = {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  statusFilter?: string;
  searchTerm?: string;
  assignmentFilter?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
};

const SectorPatientList = ({
  className,
  limit,
  showViewAll = false,
  statusFilter = 'all',
  searchTerm = '',
  assignmentFilter = 'all',
  sortBy = 'name',
  sortDirection = 'asc'
}: SectorPatientListProps) => {
  const { language } = useTranslation();
  const { 
    sectorPatients, 
    patientsLoading, 
    selectedSector,
    assignPatient,
    unassignPatient 
  } = useSectorContext();
  
  // Filter and sort patients
  const processedPatients = useMemo(() => {
    // First filter the patients
    let filtered = sectorPatients.filter(patient => {
      // Filter by status
      if (statusFilter !== 'all' && patient.status !== statusFilter) {
        return false;
      }
      
      // Filter by assignment
      if (assignmentFilter === 'assigned' && !patient.is_assigned) {
        return false;
      } else if (assignmentFilter === 'unassigned' && patient.is_assigned) {
        return false;
      }
      
      // Filter by search term (case insensitive)
      if (searchTerm && !`${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    // Then sort the filtered patients
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'room':
          const roomA = a.room_number || '';
          const roomB = b.room_number || '';
          comparison = roomA.localeCompare(roomB);
          break;
        case 'date':
          comparison = new Date(a.date_of_birth).getTime() - new Date(b.date_of_birth).getTime();
          break;
        default:
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [sectorPatients, statusFilter, searchTerm, assignmentFilter, sortBy, sortDirection]);
  
  // Limit the number of patients shown if requested
  const patients = limit ? processedPatients.slice(0, limit) : processedPatients;
  
  // Handle assignment toggle
  const toggleAssignment = async (patient: SectorPatient, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (patient.is_assigned) {
      await unassignPatient(patient.id);
    } else {
      await assignPatient(patient.id);
    }
  };
  
  if (patientsLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          <TranslatedText
            textKey="loadingPatients"
            fallback={language === 'pt' ? 'Carregando pacientes...' : 'Loading patients...'}
          />
        </p>
      </div>
    );
  }
  
  if (!selectedSector) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          <TranslatedText
            textKey="noSectorSelected"
            fallback={language === 'pt' ? 'Nenhum setor selecionado' : 'No sector selected'}
          />
        </p>
      </div>
    );
  }
  
  if (patients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          <TranslatedText
            textKey="noPatientFound"
            fallback={language === 'pt' ? 'Nenhum paciente encontrado' : 'No patients found'}
          />
        </p>
      </div>
    );
  }
  
  // Format date to calculate age
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const isCritical = (status: string): boolean => {
    return status === 'critical';
  };
  
  return (
    <div className={cn("space-y-1", className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {selectedSector.name} - 
          <span className="ml-2 text-muted-foreground">
            {processedPatients.length} {language === 'pt' ? 'pacientes' : 'patients'}
          </span>
        </h2>
      </div>
      <div className="divide-y divide-border">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={{
              id: patient.id,
              name: `${patient.first_name} ${patient.last_name}`,
              age: calculateAge(patient.date_of_birth),
              gender: patient.gender || 'unknown',
              roomNumber: patient.room_number,
              status: patient.status as any,
              isAssigned: patient.is_assigned,
              isCritical: isCritical(patient.status),
              mrn: patient.mrn,
              onToggleAssignment: (e) => toggleAssignment(patient, e)
            }}
          />
        ))}
      </div>
      
      {showViewAll && patients.length > 0 && (
        <div className="mt-4 text-center">
          <Button variant="outline" size="sm" asChild>
            <Link 
              to="/patients" 
              className="inline-flex items-center gap-1"
            >
              <TranslatedText
                textKey="viewAllPatients"
                fallback={language === 'pt' ? 'Ver todos os pacientes' : 'View all patients'}
              />
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default SectorPatientList;
