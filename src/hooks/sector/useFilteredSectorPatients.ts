
import { useState, useEffect, useMemo } from 'react';
import { SectorPatient } from '@/types/sector';

export interface InitialFilterOptions {
  statusFilter?: string;
  searchTerm?: string;
  assignmentFilter?: 'all' | 'assigned' | 'unassigned';
  sortBy?: 'name' | 'status' | 'room' | 'date';
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  page?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export const useFilteredSectorPatients = (
  patients: SectorPatient[],
  initialOptions: InitialFilterOptions = {}
) => {
  // State for filters
  const [statusFilter, setStatusFilter] = useState(initialOptions.statusFilter || 'all');
  const [searchTerm, setSearchTerm] = useState(initialOptions.searchTerm || '');
  const [assignmentFilter, setAssignmentFilter] = useState(initialOptions.assignmentFilter || 'all');
  const [sortBy, setSortBy] = useState(initialOptions.sortBy || 'name');
  const [sortDirection, setSortDirection] = useState(initialOptions.sortDirection || 'asc');
  const [page, setPage] = useState(initialOptions.page || 1);
  const pageSize = initialOptions.pageSize || 10;
  
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchTerm, assignmentFilter, sortBy, sortDirection]);
  
  // Filter and sort patients
  const filteredPatients = useMemo(() => {
    let result = [...patients];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(patient => patient.status === statusFilter);
    }
    
    // Apply assignment filter
    if (assignmentFilter === 'assigned') {
      result = result.filter(patient => patient.is_assigned);
    } else if (assignmentFilter === 'unassigned') {
      result = result.filter(patient => !patient.is_assigned);
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(patient => 
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(lowercaseSearch) ||
        patient.mrn?.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'room':
          comparison = (a.room_number || '').localeCompare(b.room_number || '');
          break;
        case 'date':
          comparison = new Date(a.date_of_birth).getTime() - new Date(b.date_of_birth).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [patients, statusFilter, searchTerm, assignmentFilter, sortBy, sortDirection]);
  
  // Calculate pagination
  const pagination: Pagination = useMemo(() => {
    const totalItems = filteredPatients.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const validPage = Math.min(Math.max(1, page), totalPages);
    
    if (page !== validPage) {
      setPage(validPage);
    }
    
    return {
      currentPage: validPage,
      totalPages,
      totalItems,
      pageSize
    };
  }, [filteredPatients.length, page, pageSize]);
  
  // Get current page data
  const displayedPatients = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredPatients.slice(startIndex, endIndex);
  }, [filteredPatients, pagination]);
  
  // Navigation function
  const goToPage = (newPage: number) => {
    const validPage = Math.min(Math.max(1, newPage), pagination.totalPages);
    setPage(validPage);
  };
  
  return {
    displayedPatients,
    pagination,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    assignmentFilter,
    setAssignmentFilter,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    setPage,
    goToPage
  };
};
