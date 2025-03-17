
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowRight } from 'lucide-react';
import { useSectorContext } from '@/hooks/useSectorContext';
import TranslatedText from '@/components/common/TranslatedText';
import PatientCard from '@/components/patients/PatientCard';
import { useFilteredSectorPatients } from '@/hooks/sector/useFilteredSectorPatients';
import SectorPatientListSkeleton from './SectorPatientListSkeleton';
import SectorPatientListPagination from './SectorPatientListPagination';
import { EmptyState } from '@/components/ui/empty-state';

type SectorPatientListProps = {
  className?: string;
  limit?: number;
  showViewAll?: boolean;
  statusFilter?: string;
  searchTerm?: string;
  assignmentFilter?: 'all' | 'assigned' | 'unassigned';
  sortBy?: 'name' | 'status' | 'room' | 'date';
  sortDirection?: 'asc' | 'desc';
  showPagination?: boolean;
  pageSize?: number;
};

const SectorPatientList = ({
  className,
  limit,
  showViewAll = false,
  statusFilter = 'all',
  searchTerm = '',
  assignmentFilter = 'all',
  sortBy = 'name',
  sortDirection = 'asc',
  showPagination = true,
  pageSize = 10
}: SectorPatientListProps) => {
  const { language } = useTranslation();
  const { 
    sectorPatients, 
    patientsLoading, 
    selectedSector,
    assignPatient,
    unassignPatient,
    refreshPatients
  } = useSectorContext();
  
  // Use the filtered patients hook
  const {
    displayedPatients,
    pagination,
    setStatusFilter,
    setSearchTerm,
    setAssignmentFilter,
    setSortBy,
    setSortDirection,
    setPage,
    goToPage
  } = useFilteredSectorPatients(sectorPatients, {
    statusFilter,
    searchTerm,
    assignmentFilter,
    sortBy,
    sortDirection,
    pageSize: limit || pageSize,
    page: 1
  });
  
  // Handle assignment toggle
  const toggleAssignment = async (patientId: string, isAssigned: boolean, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isAssigned) {
      await unassignPatient(patientId);
    } else {
      await assignPatient(patientId);
    }
  };
  
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
  
  // If loading, show skeleton loader with appropriate count
  if (patientsLoading) {
    return <SectorPatientListSkeleton count={limit || 5} />;
  }
  
  // If no sector selected, show empty state
  if (!selectedSector) {
    return (
      <EmptyState
        variant="default"
        title={language === 'pt' ? 'Nenhum setor selecionado' : 'No sector selected'}
        description={language === 'pt' 
          ? 'Selecione um setor para ver os pacientes' 
          : 'Select a sector to view patients'}
        actionLabel={language === 'pt' ? 'Selecionar Setor' : 'Select Sector'}
        onAction={() => window.location.href = '/sectors'}
      />
    );
  }
  
  // If no patients found, show empty state with appropriate variant
  if (pagination.totalItems === 0) {
    const emptyStateProps = searchTerm 
      ? {
          variant: 'search' as const,
          title: language === 'pt' ? 'Nenhum paciente encontrado' : 'No patients found',
          description: language === 'pt' 
            ? `Não encontramos resultados para "${searchTerm}"` 
            : `No results found for "${searchTerm}"`,
          actionLabel: language === 'pt' ? 'Limpar busca' : 'Clear search',
          onAction: () => setSearchTerm('')
        }
      : statusFilter !== 'all' || assignmentFilter !== 'all'
        ? {
            variant: 'filter' as const,
            title: language === 'pt' ? 'Nenhum paciente corresponde aos filtros' : 'No patients match your filters',
            description: language === 'pt' 
              ? 'Tente ajustar os filtros para ver mais resultados' 
              : 'Try adjusting the filters to see more results',
            actionLabel: language === 'pt' ? 'Limpar filtros' : 'Clear filters',
            onAction: () => {
              setStatusFilter('all');
              setAssignmentFilter('all');
            }
          }
        : {
            variant: 'default' as const,
            title: language === 'pt' ? 'Nenhum paciente neste setor' : 'No patients in this sector',
            description: language === 'pt' 
              ? 'Não há pacientes registrados no momento' 
              : 'There are no patients registered at the moment',
            actionLabel: language === 'pt' ? 'Atualizar' : 'Refresh',
            onAction: () => refreshPatients()
          };
          
    return <EmptyState {...emptyStateProps} />;
  }
  
  return (
    <div className={cn("space-y-1", className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {selectedSector.name} - 
          <span className="ml-2 text-muted-foreground">
            {pagination.totalItems} {language === 'pt' ? 'pacientes' : 'patients'}
          </span>
        </h2>
      </div>
      <div className="divide-y divide-border">
        {displayedPatients.map((patient) => (
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
              onToggleAssignment: (e) => toggleAssignment(patient.id, patient.is_assigned, e)
            }}
          />
        ))}
      </div>
      
      {/* Pagination */}
      {showPagination && pagination.totalPages > 1 && (
        <SectorPatientListPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={goToPage}
        />
      )}
      
      {showViewAll && pagination.totalItems > 0 && (
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
