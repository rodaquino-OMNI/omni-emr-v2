
import { useState, useMemo, useEffect } from 'react';
import { SectorPatient } from '@/types/sectorTypes';

export type PatientAssignmentFilter = 'all' | 'assigned' | 'unassigned';
export type PatientSortField = 'name' | 'status' | 'room' | 'date';
export type SortDirection = 'asc' | 'desc';

interface FilterOptions {
  statusFilter: string;
  searchTerm: string;
  assignmentFilter: PatientAssignmentFilter;
  sortBy: PatientSortField;
  sortDirection: SortDirection;
  pageSize: number;
  page: number;
}

interface UseFilteredPatientsParams {
  patients: SectorPatient[];
  options: FilterOptions;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export const useFilteredSectorPatients = ({ patients, options }: UseFilteredPatientsParams) => {
  const [statusFilter, setStatusFilter] = useState<string>(options.statusFilter);
  const [searchTerm, setSearchTerm] = useState<string>(options.searchTerm);
  const [assignmentFilter, setAssignmentFilter] = useState<PatientAssignmentFilter>(options.assignmentFilter);
  const [sortBy, setSortBy] = useState<PatientSortField>(options.sortBy);
  const [sortDirection, setSortDirection] = useState<SortDirection>(options.sortDirection);
  const [page, setPage] = useState<number>(options.page);
  const [pageSize, setPageSize] = useState<number>(options.pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchTerm, assignmentFilter, sortBy, sortDirection, pageSize]);

  // Filter patients based on criteria
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
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

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchLower);
        const mrnMatch = patient.mrn.toLowerCase().includes(searchLower);
        const roomMatch = patient.room_number ? patient.room_number.toLowerCase().includes(searchLower) : false;
        
        if (!nameMatch && !mrnMatch && !roomMatch) {
          return false;
        }
      }

      return true;
    });
  }, [patients, statusFilter, searchTerm, assignmentFilter]);

  // Sort filtered patients
  const sortedPatients = useMemo(() => {
    return [...filteredPatients].sort((a, b) => {
      let compareResult = 0;

      switch (sortBy) {
        case 'name':
          compareResult = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'status':
          compareResult = (a.status || '').localeCompare(b.status || '');
          break;
        case 'room':
          compareResult = (a.room_number || '').localeCompare(b.room_number || '');
          break;
        case 'date':
          // Handle date comparison with fallbacks
          const dateA = a.date_of_birth ? new Date(a.date_of_birth).getTime() : 0;
          const dateB = b.date_of_birth ? new Date(b.date_of_birth).getTime() : 0;
          compareResult = dateA - dateB;
          break;
      }

      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  }, [filteredPatients, sortBy, sortDirection]);

  // Pagination logic
  const totalItems = sortedPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Adjust page if it's out of bounds
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // Get current page of patients
  const displayedPatients = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedPatients.slice(start, end);
  }, [sortedPatients, page, pageSize]);

  // Pagination info
  const pagination: PaginationInfo = {
    currentPage: page,
    totalPages,
    totalItems,
    pageSize
  };

  // Go to specific page
  const goToPage = (newPage: number) => {
    setPage(Math.min(Math.max(1, newPage), totalPages));
  };

  // Current filter options state
  const filterOptions = {
    statusFilter,
    searchTerm,
    assignmentFilter,
    sortBy,
    sortDirection,
    page,
    pageSize
  };

  return {
    filteredPatients,
    displayedPatients,
    pagination,
    setStatusFilter,
    setSearchTerm,
    setAssignmentFilter,
    setSortBy,
    setSortDirection,
    setPage,
    setPageSize,
    goToPage,
    filterOptions
  };
};
