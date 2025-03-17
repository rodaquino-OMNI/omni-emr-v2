
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import SectorPatientList from '../components/patients/SectorPatientList';
import { PlusCircle, RefreshCw, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTranslation } from '../hooks/useTranslation';
import { useSectorContext } from '@/hooks/useSectorContext';
import TranslatedText from '@/components/common/TranslatedText';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useFilteredSectorPatients, PatientAssignmentFilter, PatientSortField, SortDirection } from '@/hooks/sector/useFilteredSectorPatients';
import SectorPatientListPagination from '@/components/patients/SectorPatientListPagination';
import { toast } from 'sonner';

const PatientsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const { selectedSector, refreshPatients, patientsLoading, sectorPatients } = useSectorContext();
  
  const queryParams = new URLSearchParams(location.search);
  const statusFromUrl = queryParams.get('status') || 'all';
  const assignmentFromUrl = queryParams.get('assigned') || 'all';
  const sortByFromUrl = queryParams.get('sortBy') || 'name';
  const sortDirFromUrl = queryParams.get('sortDir') || 'asc';
  const pageFromUrl = queryParams.get('page') ? parseInt(queryParams.get('page') || '1') : 1;
  const pageSizeFromUrl = queryParams.get('pageSize') ? parseInt(queryParams.get('pageSize') || '10') : 10;
  const searchTermFromUrl = queryParams.get('search') || '';

  // Use the hook with proper parameters
  const {
    displayedPatients,
    pagination,
    filterOptions,
    setStatusFilter,
    setSearchTerm,
    setAssignmentFilter,
    setSortBy,
    setSortDirection,
    setPage,
    setPageSize,
    goToPage
  } = useFilteredSectorPatients({
    patients: sectorPatients,
    options: {
      statusFilter: statusFromUrl,
      assignmentFilter: assignmentFromUrl as PatientAssignmentFilter,
      sortBy: sortByFromUrl as PatientSortField,
      sortDirection: sortDirFromUrl as SortDirection,
      page: pageFromUrl,
      pageSize: pageSizeFromUrl,
      searchTerm: searchTermFromUrl
    }
  });

  const statuses = [
    { value: 'all', label: language === 'pt' ? 'Todos os Pacientes' : 'All Patients' },
    { value: 'active', label: language === 'pt' ? 'Ativos' : 'Active' },
    { value: 'critical', label: language === 'pt' ? 'Críticos' : 'Critical' },
    { value: 'stable', label: language === 'pt' ? 'Estáveis' : 'Stable' },
    { value: 'improving', label: language === 'pt' ? 'Melhorando' : 'Improving' },
    { value: 'discharged', label: language === 'pt' ? 'Alta' : 'Discharged' },
  ];

  const assignmentOptions = [
    { value: 'all', label: language === 'pt' ? 'Todos os Pacientes' : 'All Patients' },
    { value: 'assigned', label: language === 'pt' ? 'Atribuídos a Mim' : 'Assigned to Me' },
    { value: 'unassigned', label: language === 'pt' ? 'Não Atribuídos' : 'Unassigned' },
  ];

  const sortOptions = [
    { value: 'name', label: language === 'pt' ? 'Nome' : 'Name' },
    { value: 'status', label: language === 'pt' ? 'Status' : 'Status' },
    { value: 'room', label: language === 'pt' ? 'Quarto' : 'Room' },
    { value: 'date', label: language === 'pt' ? 'Data de Nascimento' : 'Date of Birth' },
  ];

  const pageSizeOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

  const updateUrlWithFilters = () => {
    const newParams = new URLSearchParams();
    
    if (filterOptions.statusFilter !== 'all') {
      newParams.set('status', filterOptions.statusFilter);
    }
    
    if (filterOptions.assignmentFilter !== 'all') {
      newParams.set('assigned', filterOptions.assignmentFilter);
    }
    
    if (filterOptions.sortBy !== 'name') {
      newParams.set('sortBy', filterOptions.sortBy);
    }
    
    if (filterOptions.sortDirection !== 'asc') {
      newParams.set('sortDir', filterOptions.sortDirection);
    }
    
    if (filterOptions.page !== 1) {
      newParams.set('page', filterOptions.page.toString());
    }
    
    if (filterOptions.pageSize !== 10) {
      newParams.set('pageSize', filterOptions.pageSize.toString());
    }

    if (filterOptions.searchTerm) {
      newParams.set('search', filterOptions.searchTerm);
    }
    
    navigate(`/patients${newParams.toString() ? `?${newParams.toString()}` : ''}`);
  };

  useEffect(() => {
    updateUrlWithFilters();
  }, [
    filterOptions.statusFilter, 
    filterOptions.assignmentFilter, 
    filterOptions.sortBy, 
    filterOptions.sortDirection,
    filterOptions.page,
    filterOptions.pageSize,
    filterOptions.searchTerm
  ]);

  const handleNewPatient = () => {
    navigate('/patients/new');
  };

  const handleRefresh = async () => {
    await refreshPatients();
    toast.success(
      language === 'pt' ? 'Lista de pacientes atualizada' : 'Patient list refreshed'
    );
  };

  if (!selectedSector) {
    navigate('/sectors');
    return null;
  }

  const clearFilters = () => {
    setStatusFilter('all');
    setAssignmentFilter('all');
    setSearchTerm('');
    setPage(1);
    navigate('/patients');
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(parseInt(newSize));
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleAssignmentChange = (value: string) => {
    setAssignmentFilter(value as PatientAssignmentFilter);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  {language === 'pt' ? 'Pacientes' : 'Patients'}
                </h1>
                <Badge variant="outline" className="ml-2 bg-primary/10 text-xs px-2">
                  {selectedSector.name}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'pt' ? "Buscar pacientes..." : "Search patients..."}
                    className="w-full h-9 pl-3 pr-3 rounded-md border border-border bg-background"
                    value={filterOptions.searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select
                  value={filterOptions.statusFilter}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={filterOptions.assignmentFilter}
                  onValueChange={handleAssignmentChange}
                >
                  <SelectTrigger className="h-9 w-[160px]">
                    <SelectValue placeholder="Assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignmentOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 px-3 gap-1">
                      {filterOptions.sortDirection === 'asc' ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      )}
                      {language === 'pt' ? 'Ordenar' : 'Sort'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      {language === 'pt' ? 'Ordenar por' : 'Sort by'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {sortOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option.value}
                        className={filterOptions.sortBy === option.value ? "bg-accent" : ""}
                        onClick={() => setSortBy(option.value as PatientSortField)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSortDirection(filterOptions.sortDirection === 'asc' ? 'desc' : 'asc')}>
                      {filterOptions.sortDirection === 'asc' ? (
                        <><SortAsc className="mr-2 h-4 w-4" /> {language === 'pt' ? 'Crescente' : 'Ascending'}</>
                      ) : (
                        <><SortDesc className="mr-2 h-4 w-4" /> {language === 'pt' ? 'Decrescente' : 'Descending'}</>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button onClick={handleRefresh} variant="outline" className="h-9 flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearFilters} 
                  className="h-9 px-3"
                  disabled={
                    filterOptions.statusFilter === 'all' && 
                    filterOptions.assignmentFilter === 'all' && 
                    !filterOptions.searchTerm
                  }
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {language === 'pt' ? 'Limpar' : 'Clear'}
                </Button>
                
                <Button onClick={handleNewPatient} className="h-9 flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  <TranslatedText 
                    textKey="newPatient" 
                    fallback={language === 'pt' ? 'Novo Paciente' : 'New Patient'} 
                  />
                </Button>
              </div>
            </div>
            
            <div className="glass-card p-6 relative">
              <LoadingOverlay isLoading={patientsLoading} text={language === 'pt' ? 'Carregando pacientes...' : 'Loading patients...'}>
                <SectorPatientList 
                  statusFilter={filterOptions.statusFilter} 
                  searchTerm={filterOptions.searchTerm} 
                  assignmentFilter={filterOptions.assignmentFilter}
                  sortBy={filterOptions.sortBy}
                  sortDirection={filterOptions.sortDirection}
                  showPagination={false}
                />
                
                {pagination.totalPages > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-muted-foreground">
                      {language === 'pt' 
                        ? `Mostrando ${(pagination.currentPage - 1) * filterOptions.pageSize + 1} a ${Math.min(pagination.currentPage * filterOptions.pageSize, pagination.totalItems)} de ${pagination.totalItems} pacientes`
                        : `Showing ${(pagination.currentPage - 1) * filterOptions.pageSize + 1} to ${Math.min(pagination.currentPage * filterOptions.pageSize, pagination.totalItems)} of ${pagination.totalItems} patients`
                      }
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {language === 'pt' ? 'Itens por página:' : 'Items per page:'}
                        </span>
                        <Select value={filterOptions.pageSize.toString()} onValueChange={handlePageSizeChange}>
                          <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder="10" />
                          </SelectTrigger>
                          <SelectContent>
                            {pageSizeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <SectorPatientListPagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={goToPage}
                      />
                    </div>
                  </div>
                )}
              </LoadingOverlay>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientsPage;
