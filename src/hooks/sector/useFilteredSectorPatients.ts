
import { useState, useMemo } from 'react';
import { SectorPatient } from '@/types/sectorTypes';

export type SortDirection = 'asc' | 'desc';
export type PatientSortField = 'name' | 'status' | 'room' | 'date';
export type PatientAssignmentFilter = 'all' | 'assigned' | 'unassigned';

interface FilterOptions {
  statusFilter: string;
  searchTerm: string;
  assignmentFilter: PatientAssignmentFilter;
  sortBy: PatientSortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: number;
}

interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface UseFilteredPatientsResult {
  filteredPatients: SectorPatient[];
  displayedPatients: SectorPatient[];
  pagination: PaginationResult;
  filterOptions: FilterOptions;
  setStatusFilter: (value: string) => void;
  setSearchTerm: (value: string) => void;
  setAssignmentFilter: (value: PatientAssignmentFilter) => void;
  setSortBy: (value: PatientSortField) => void;
  setSortDirection: (value: SortDirection) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
}

export const useFilteredSectorPatients = (
  patients: SectorPatient[],
  initialFilters?: Partial<FilterOptions>
): UseFilteredPatientsResult => {
  // Default filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    statusFilter: initialFilters?.statusFilter || 'all',
    searchTerm: initialFilters?.searchTerm || '',
    assignmentFilter: initialFilters?.assignmentFilter || 'all',
    sortBy: initialFilters?.sortBy || 'name',
    sortDirection: initialFilters?.sortDirection || 'asc',
    page: initialFilters?.page || 1,
    pageSize: initialFilters?.pageSize || 10
  });

  // Filter and sort patients based on filter options
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // Filter by status
      if (filterOptions.statusFilter !== 'all' && patient.status !== filterOptions.statusFilter) {
        return false;
      }
      
      // Filter by assignment
      if (filterOptions.assignmentFilter === 'assigned' && !patient.is_assigned) {
        return false;
      } else if (filterOptions.assignmentFilter === 'unassigned' && patient.is_assigned) {
        return false;
      }
      
      // Filter by search term (case insensitive)
      if (filterOptions.searchTerm && !`${patient.first_name} ${patient.last_name}`.toLowerCase().includes(filterOptions.searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      let comparison = 0;
      
      switch (filterOptions.sortBy) {
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
      
      return filterOptions.sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [patients, filterOptions]);

  // Calculate pagination details
  const totalItems = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / filterOptions.pageSize));
  const currentPage = Math.min(Math.max(1, filterOptions.page), totalPages);
  
  // Get current page of patients
  const startIndex = (currentPage - 1) * filterOptions.pageSize;
  const displayedPatients = filteredPatients.slice(
    startIndex, 
    startIndex + filterOptions.pageSize
  );

  // Update filter methods
  const setStatusFilter = (value: string) => {
    setFilterOptions(prev => ({ ...prev, statusFilter: value, page: 1 }));
  };

  const setSearchTerm = (value: string) => {
    setFilterOptions(prev => ({ ...prev, searchTerm: value, page: 1 }));
  };

  const setAssignmentFilter = (value: PatientAssignmentFilter) => {
    setFilterOptions(prev => ({ ...prev, assignmentFilter: value, page: 1 }));
  };

  const setSortBy = (value: PatientSortField) => {
    setFilterOptions(prev => ({ ...prev, sortBy: value }));
  };

  const setSortDirection = (value: SortDirection) => {
    setFilterOptions(prev => ({ ...prev, sortDirection: value }));
  };

  const setPage = (page: number) => {
    setFilterOptions(prev => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setFilterOptions(prev => ({ ...prev, pageSize, page: 1 }));
  };

  // Navigation helpers
  const nextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setPage(Math.min(Math.max(1, page), totalPages));
  };

  return {
    filteredPatients,
    displayedPatients,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    },
    filterOptions,
    setStatusFilter,
    setSearchTerm,
    setAssignmentFilter,
    setSortBy,
    setSortDirection,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    goToPage
  };
};
