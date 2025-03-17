
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSectorContext } from '@/hooks/useSectorContext';
import { InitialFilterOptions } from '@/types/patientTypes';

export type PatientAssignmentFilter = 'all' | 'assigned' | 'unassigned';
export type PatientSortField = 'name' | 'status' | 'room' | 'dateAdded' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface SectorPatient {
  id: string;
  name: string;
  status: string;
  roomNumber?: string;
  mrn: string;
  isAssigned: boolean;
  dateAdded: string;
  lastUpdated: string;
}

export const useFilteredSectorPatients = (
  initialOptions: InitialFilterOptions = {}
) => {
  const { t } = useTranslation();
  const { selectedSector, patientsInSector, isLoading: sectorLoading } = useSectorContext();
  
  // Setup state for filters and pagination
  const [statusFilter, setStatusFilter] = useState(initialOptions.status || 'all');
  const [assignmentFilter, setAssignmentFilter] = useState<PatientAssignmentFilter>('all');
  const [searchQuery, setSearchQuery] = useState(initialOptions.searchTerm || '');
  const [sortBy, setSortBy] = useState<PatientSortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, assignmentFilter, searchQuery, sortBy, sortDirection]);
  
  // Get filtered and sorted patients
  const filteredPatients = useMemo(() => {
    // Start with all patients in sector
    let result = [...(patientsInSector || [])];
    
    // Filter by status
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(patient => patient.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Filter by assignment
    if (assignmentFilter !== 'all') {
      result = result.filter(patient => 
        assignmentFilter === 'assigned' ? patient.isAssigned : !patient.isAssigned
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.mrn.toLowerCase().includes(query) ||
        (patient.roomNumber && patient.roomNumber.toLowerCase().includes(query))
      );
    }
    
    // Sort patients
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'room':
          const roomA = a.roomNumber || '';
          const roomB = b.roomNumber || '';
          comparison = roomA.localeCompare(roomB);
          break;
        case 'dateAdded':
          comparison = new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
          break;
        case 'updatedAt':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [patientsInSector, statusFilter, assignmentFilter, searchQuery, sortBy, sortDirection]);
  
  // Paginate the results
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPatients.slice(startIndex, endIndex);
  }, [filteredPatients, currentPage, pageSize]);
  
  // Calculate pagination metadata
  const pagination: Pagination = useMemo(() => ({
    currentPage,
    totalPages: Math.max(1, Math.ceil(filteredPatients.length / pageSize)),
    totalItems: filteredPatients.length,
    pageSize
  }), [filteredPatients.length, currentPage, pageSize]);
  
  // Navigation helpers
  const goToPage = (newPage: number) => {
    const clampedPage = Math.max(1, Math.min(newPage, pagination.totalPages));
    setCurrentPage(clampedPage);
  };
  
  const nextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  // Filter options for UI
  const filterOptions = {
    status: [
      { value: 'all', label: t('all') },
      { value: 'active', label: t('active') },
      { value: 'critical', label: t('critical') },
      { value: 'stable', label: t('stable') },
      { value: 'discharged', label: t('discharged') }
    ],
    assignment: [
      { value: 'all', label: t('allPatients') },
      { value: 'assigned', label: t('assignedToMe') },
      { value: 'unassigned', label: t('unassigned') }
    ]
  };
  
  return {
    displayedPatients: paginatedPatients,
    filteredPatients,
    pagination,
    statusFilter,
    setStatusFilter,
    assignmentFilter,
    setAssignmentFilter: setAssignmentFilter as (value: string) => void,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    nextPage,
    prevPage,
    goToPage,
    isLoading: sectorLoading,
    filterOptions,
    setPageSize
  };
};
