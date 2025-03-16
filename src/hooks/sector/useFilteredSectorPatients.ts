
import { useState, useMemo, useEffect } from 'react';
import { SectorPatient } from '@/types/sectorTypes';

export type PatientAssignmentFilter = 'all' | 'assigned' | 'unassigned';
export type PatientSortField = 'name' | 'room' | 'status' | 'date';
export type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  statusFilter: string;
  assignmentFilter: PatientAssignmentFilter;
  searchTerm: string;
  sortBy: PatientSortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface FilteredPatientsResult {
  filteredPatients: SectorPatient[];
  displayedPatients: SectorPatient[];
  pagination: PaginationData;
  filterOptions: FilterOptions;
  setStatusFilter: (status: string) => void;
  setAssignmentFilter: (assignment: PatientAssignmentFilter) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (field: PatientSortField) => void;
  setSortDirection: (direction: SortDirection) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  goToPage: (page: number) => void;
  resetFilters: () => void;
}

interface InitialFilterOptions {
  statusFilter?: string;
  assignmentFilter?: PatientAssignmentFilter;
  sortBy?: PatientSortField;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
}

export const useFilteredSectorPatients = (
  patients: SectorPatient[],
  initialOptions?: InitialFilterOptions
): FilteredPatientsResult => {
  // Initialize filter state with defaults or provided values
  const [statusFilter, setStatusFilter] = useState<string>(initialOptions?.statusFilter || 'all');
  const [assignmentFilter, setAssignmentFilter] = useState<PatientAssignmentFilter>(
    initialOptions?.assignmentFilter || 'all'
  );
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<PatientSortField>(initialOptions?.sortBy || 'name');
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialOptions?.sortDirection || 'asc');
  const [page, setPage] = useState<number>(initialOptions?.page || 1);
  const [pageSize, setPageSize] = useState<number>(initialOptions?.pageSize || 10);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, assignmentFilter, searchTerm, sortBy, sortDirection]);

  // Apply filters to get filtered patients
  const filteredPatients = useMemo(() => {
    return patients
      .filter(patient => {
        // Filter by status
        if (statusFilter !== 'all' && patient.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false;
        }

        // Filter by assignment status
        if (assignmentFilter === 'assigned' && !patient.is_assigned) {
          return false;
        } else if (assignmentFilter === 'unassigned' && patient.is_assigned) {
          return false;
        }

        // Filter by search term
        if (searchTerm) {
          const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
          const searchLower = searchTerm.toLowerCase();
          
          return (
            fullName.includes(searchLower) ||
            patient.mrn.toLowerCase().includes(searchLower) ||
            (patient.room_number && patient.room_number.toLowerCase().includes(searchLower))
          );
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by selected field
        let comparison = 0;
        
        if (sortBy === 'name') {
          const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
          const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
          comparison = nameA.localeCompare(nameB);
        } else if (sortBy === 'room') {
          const roomA = a.room_number || '';
          const roomB = b.room_number || '';
          comparison = roomA.localeCompare(roomB);
        } else if (sortBy === 'status') {
          comparison = a.status.localeCompare(b.status);
        } else if (sortBy === 'date') {
          const dateA = new Date(a.date_of_birth).getTime();
          const dateB = new Date(b.date_of_birth).getTime();
          comparison = dateA - dateB;
        }
        
        // Apply sort direction
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [patients, statusFilter, assignmentFilter, searchTerm, sortBy, sortDirection]);

  // Calculate pagination data
  const pagination = useMemo<PaginationData>(() => {
    const totalItems = filteredPatients.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    
    // Adjust page if it's out of bounds
    const validPage = Math.min(Math.max(1, page), totalPages);
    if (validPage !== page) {
      setPage(validPage);
    }
    
    return {
      currentPage: validPage,
      totalPages,
      totalItems
    };
  }, [filteredPatients.length, page, pageSize]);

  // Get the current page of patients
  const displayedPatients = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPatients.slice(startIndex, endIndex);
  }, [filteredPatients, pagination.currentPage, pageSize]);

  // Go to a specific page
  const goToPage = (newPage: number) => {
    setPage(Math.min(Math.max(1, newPage), pagination.totalPages));
  };

  // Reset all filters to default values
  const resetFilters = () => {
    setStatusFilter('all');
    setAssignmentFilter('all');
    setSearchTerm('');
    setSortBy('name');
    setSortDirection('asc');
    setPage(1);
  };

  return {
    filteredPatients,
    displayedPatients,
    pagination,
    filterOptions: {
      statusFilter,
      assignmentFilter,
      searchTerm,
      sortBy,
      sortDirection,
      page,
      pageSize
    },
    setStatusFilter,
    setAssignmentFilter,
    setSearchTerm,
    setSortBy,
    setSortDirection,
    setPage,
    setPageSize,
    goToPage,
    resetFilters
  };
};
