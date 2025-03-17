
import { useMemo, useState } from 'react';
import { SectorPatient } from '@/types/sector';

export type PatientAssignmentFilter = 'all' | 'assigned' | 'unassigned';
export type PatientSortField = 'name' | 'roomNumber' | 'dateAdded' | 'lastUpdated';
export type SortDirection = 'asc' | 'desc';

export interface Pagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

interface UseFilteredSectorPatientsProps {
  patients: SectorPatient[];
  searchTerm?: string;
  statusFilter?: string;
  assignmentFilter?: PatientAssignmentFilter;
  sortBy?: PatientSortField;
  sortDirection?: SortDirection;
  itemsPerPage?: number;
  currentPage?: number;
}

export const useFilteredSectorPatients = ({
  patients,
  searchTerm = '',
  statusFilter = 'all',
  assignmentFilter = 'all',
  sortBy = 'name',
  sortDirection = 'asc',
  itemsPerPage = 10,
  currentPage = 1,
}: UseFilteredSectorPatientsProps) => {
  const [page, setPage] = useState(currentPage);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  const [status, setStatusFilter] = useState(statusFilter);
  const [assignment, setAssignmentFilter] = useState(assignmentFilter);
  const [sort, setSortBy] = useState(sortBy);
  const [direction, setSortDirection] = useState(sortDirection);
  const [search, setSearchTerm] = useState(searchTerm);

  // Filter patients by status, assignment, and search term
  const filteredPatients = useMemo(() => {
    let filtered = [...patients];
    
    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(patient => patient.status === status);
    }
    
    // Filter by assignment
    if (assignment !== 'all') {
      filtered = filtered.filter(patient => 
        assignment === 'assigned' ? patient.is_assigned : !patient.is_assigned
      );
    }
    
    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(patient => {
        const patientName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
        const mrn = patient.mrn?.toLowerCase() || '';
        const room = patient.room_number?.toLowerCase() || '';
        
        return patientName.includes(searchLower) || 
               mrn.includes(searchLower) || 
               room.includes(searchLower);
      });
    }
    
    // Sort patients
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sort) {
        case 'name':
          valueA = `${a.first_name} ${a.last_name}`.toLowerCase();
          valueB = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'roomNumber':
          valueA = a.room_number || '';
          valueB = b.room_number || '';
          break;
        case 'dateAdded':
          // Fall back to id if dateAdded is not available
          valueA = a.created_at || a.id;
          valueB = b.created_at || b.id;
          break;
        case 'lastUpdated':
          // Fall back to id if lastUpdated is not available
          valueA = a.updated_at || a.id;
          valueB = b.updated_at || b.id;
          break;
        default:
          valueA = `${a.first_name} ${a.last_name}`.toLowerCase();
          valueB = `${b.first_name} ${b.last_name}`.toLowerCase();
      }
      
      const comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      return direction === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [patients, status, assignment, search, sort, direction]);
  
  // Calculate pagination
  const totalItems = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  
  // Get current page items
  const displayedPatients = useMemo(() => {
    const startIndex = (validPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    return filteredPatients.slice(startIndex, endIndex);
  }, [filteredPatients, validPage, pageSize, totalItems]);
  
  // Pagination metadata
  const pagination: Pagination = {
    currentPage: validPage,
    totalPages,
    itemsPerPage: pageSize,
    totalItems,
  };
  
  // Page navigation function
  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  // Filtering options
  const filterOptions = {
    status: [
      { value: 'all', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'discharged', label: 'Discharged' },
      { value: 'pending', label: 'Pending' },
      { value: 'critical', label: 'Critical' },
    ],
    assignment: [
      { value: 'all', label: 'All Patients' },
      { value: 'assigned', label: 'Assigned to Me' },
      { value: 'unassigned', label: 'Unassigned' },
    ],
    sortBy: [
      { value: 'name', label: 'Name' },
      { value: 'roomNumber', label: 'Room' },
      { value: 'dateAdded', label: 'Date Added' },
      { value: 'lastUpdated', label: 'Last Updated' },
    ],
    sortDirection: [
      { value: 'asc', label: 'Ascending' },
      { value: 'desc', label: 'Descending' },
    ],
    page: Array.from({ length: totalPages }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Page ${i + 1}`,
    })),
    pageSize: [
      { value: '5', label: '5 per page' },
      { value: '10', label: '10 per page' },
      { value: '25', label: '25 per page' },
      { value: '50', label: '50 per page' },
    ],
  };

  return {
    displayedPatients,
    filteredPatients,
    pagination,
    statusFilter: status,
    setStatusFilter,
    assignmentFilter: assignment,
    setAssignmentFilter,
    sortBy: sort,
    setSortBy,
    sortDirection: direction,
    setSortDirection,
    searchTerm: search,
    setSearchTerm,
    filterOptions,
    page: validPage,
    setPage,
    pageSize,
    setPageSize,
    goToPage,
  };
};
