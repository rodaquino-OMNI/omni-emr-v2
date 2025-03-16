
import { useState, useMemo } from 'react';
import { SectorPatient } from '@/types/sectorTypes';

type FilterOptions = {
  searchTerm?: string;
  assignmentFilter?: 'all' | 'assigned' | 'unassigned';
  sortField?: keyof SectorPatient;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export const usePatientFiltering = (patients: SectorPatient[], options: FilterOptions = {}) => {
  const [searchTerm, setSearchTerm] = useState(options.searchTerm || '');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'assigned' | 'unassigned'>(
    options.assignmentFilter || 'all'
  );
  const [sortField, setSortField] = useState<keyof SectorPatient>(
    options.sortField || 'last_name'
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    options.sortDirection || 'asc'
  );
  const [page, setPage] = useState(options.page || 1);
  const [pageSize, setPageSize] = useState(options.pageSize || 10);
  
  // Calculate filtered patients
  const filteredPatients = useMemo(() => {
    // Filter by search term
    let result = patients.filter(patient => {
      if (!searchTerm) return true;
      
      const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        patient.mrn.toLowerCase().includes(searchLower)
      );
    });
    
    // Filter by assignment status
    if (assignmentFilter !== 'all') {
      result = result.filter(patient => 
        assignmentFilter === 'assigned' ? patient.is_assigned : !patient.is_assigned
      );
    }
    
    // Sort patients
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === bValue) return 0;
      
      const compareResult = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
    
    return result;
  }, [patients, searchTerm, assignmentFilter, sortField, sortDirection]);
  
  // Calculate paginated patients
  const paginatedPatients = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredPatients.slice(startIndex, startIndex + pageSize);
  }, [filteredPatients, page, pageSize]);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredPatients.length / pageSize);
  
  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };
  
  return {
    // State
    searchTerm,
    assignmentFilter,
    sortField,
    sortDirection,
    page,
    pageSize,
    
    // Results
    filteredPatients,
    paginatedPatients,
    totalPages,
    totalItems: filteredPatients.length,
    
    // Actions
    setSearchTerm,
    setAssignmentFilter,
    setSortField,
    setSortDirection,
    setPage,
    setPageSize,
    handlePageChange,
    
    // Helpers
    handleNextPage: () => handlePageChange(page + 1),
    handlePrevPage: () => handlePageChange(page - 1),
    canNextPage: page < totalPages,
    canPrevPage: page > 1,
  };
};
