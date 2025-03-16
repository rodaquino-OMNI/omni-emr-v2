
import React, { useState, useMemo } from 'react';
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

const PatientsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const { selectedSector, refreshPatients, patientsLoading } = useSectorContext();
  
  // Get status from URL query params
  const queryParams = new URLSearchParams(location.search);
  const statusFromUrl = queryParams.get('status') || 'all';
  const assignmentFromUrl = queryParams.get('assigned') || 'all';
  const sortByFromUrl = queryParams.get('sortBy') || 'name';
  const sortDirFromUrl = queryParams.get('sortDir') || 'asc';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(statusFromUrl);
  const [assignmentFilter, setAssignmentFilter] = useState<string>(assignmentFromUrl);
  const [sortBy, setSortBy] = useState<string>(sortByFromUrl);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(sortDirFromUrl as 'asc' | 'desc');
  
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

  // Update URL with all filters
  const updateUrlWithFilters = (filters: Record<string, string>) => {
    const newParams = new URLSearchParams(location.search);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value === 'all' && key !== 'sortBy' && key !== 'sortDir') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    navigate(`/patients?${newParams.toString()}`);
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    updateUrlWithFilters({ status: value, assigned: assignmentFilter, sortBy, sortDir: sortDirection });
  };

  // Handle assignment filter change
  const handleAssignmentChange = (value: string) => {
    setAssignmentFilter(value);
    updateUrlWithFilters({ status: statusFilter, assigned: value, sortBy, sortDir: sortDirection });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateUrlWithFilters({ status: statusFilter, assigned: assignmentFilter, sortBy: value, sortDir: sortDirection });
  };

  // Toggle sort direction
  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    updateUrlWithFilters({ status: statusFilter, assigned: assignmentFilter, sortBy, sortDir: newDirection });
  };

  const handleNewPatient = () => {
    // For now, just navigate to the first patient as a placeholder
    // In a real app, this would open a form to create a new patient
    navigate('/patients/new');
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refreshPatients();
  };

  // If no sector is selected, redirect to sector selection
  if (!selectedSector) {
    navigate('/sectors');
    return null;
  }

  const clearFilters = () => {
    setStatusFilter('all');
    setAssignmentFilter('all');
    setSearchTerm('');
    navigate('/patients');
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select
                  value={statusFilter}
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
                  value={assignmentFilter}
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
                      <SortAsc className="h-4 w-4" />
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
                        className={sortBy === option.value ? "bg-accent" : ""}
                        onClick={() => handleSortChange(option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={toggleSortDirection}>
                      {sortDirection === 'asc' ? (
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
                  disabled={statusFilter === 'all' && assignmentFilter === 'all' && !searchTerm}
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
            
            <div className="glass-card p-6">
              <SectorPatientList 
                statusFilter={statusFilter} 
                searchTerm={searchTerm} 
                assignmentFilter={assignmentFilter}
                sortBy={sortBy}
                sortDirection={sortDirection}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientsPage;
