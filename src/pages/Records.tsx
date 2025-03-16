
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import RecordsList from '../components/records/RecordsList';
import { FilePlus, Search, Filter, Calendar, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecordFilters, RecordTypeOption } from '@/types/medicalRecordTypes';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import NewRecordForm from '../components/records/NewRecordForm';

const RecordsPage = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<RecordFilters>({
    typeFilter: 'all',
    statusFilter: 'all',
    dateRange: undefined
  });
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const recordTypes: RecordTypeOption[] = [
    { value: 'all', label: language === 'pt' ? 'Todos os Registros' : 'All Records' },
    { value: 'lab', label: language === 'pt' ? 'Resultados de Laboratório' : 'Lab Results' },
    { value: 'imaging', label: language === 'pt' ? 'Imagens' : 'Imaging' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimentos' : 'Procedures' },
    { value: 'visit', label: language === 'pt' ? 'Notas de Visita' : 'Visit Notes' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' },
  ];
  
  const recordStatuses: RecordTypeOption[] = [
    { value: 'all', label: language === 'pt' ? 'Todos os Status' : 'All Statuses' },
    { value: 'completed', label: language === 'pt' ? 'Concluído' : 'Completed' },
    { value: 'pending', label: language === 'pt' ? 'Pendente' : 'Pending' },
    { value: 'cancelled', label: language === 'pt' ? 'Cancelado' : 'Cancelled' },
  ];

  const handleRecordCreated = () => {
    setIsNewRecordOpen(false);
    // We could refresh the records list here
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };
  
  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, typeFilter: e.target.value }));
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, statusFilter: e.target.value }));
  };
  
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      typeFilter: 'all',
      statusFilter: 'all',
      dateRange: undefined,
      searchTerm: ''
    });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">
                {language === 'pt' ? 'Registros Médicos' : 'Medical Records'}
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'pt' ? "Buscar registros..." : "Search records..."}
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                
                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10">
                      <Filter className="h-4 w-4 mr-2" />
                      {language === 'pt' ? 'Filtros' : 'Filters'}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>
                        {language === 'pt' ? 'Filtrar Registros' : 'Filter Records'}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          {language === 'pt' ? 'Tipo de Registro' : 'Record Type'}
                        </label>
                        <select
                          className="w-full h-10 rounded-md border border-border bg-background px-3"
                          value={filters.typeFilter}
                          onChange={handleTypeFilterChange}
                        >
                          {recordTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          {language === 'pt' ? 'Status' : 'Status'}
                        </label>
                        <select
                          className="w-full h-10 rounded-md border border-border bg-background px-3"
                          value={filters.statusFilter}
                          onChange={handleStatusFilterChange}
                        >
                          {recordStatuses.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          {language === 'pt' ? 'Período' : 'Date Range'}
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between text-left font-normal h-10"
                            >
                              {filters.dateRange?.from ? (
                                filters.dateRange.to ? (
                                  <>
                                    {format(filters.dateRange.from, 'P')} -{' '}
                                    {format(filters.dateRange.to, 'P')}
                                  </>
                                ) : (
                                  format(filters.dateRange.from, 'P')
                                )
                              ) : (
                                <span className="text-muted-foreground">
                                  {language === 'pt' ? 'Selecione um período' : 'Select date range'}
                                </span>
                              )}
                              {filters.dateRange?.from && (
                                <X
                                  className="h-4 w-4 opacity-50 hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFilters(prev => ({ ...prev, dateRange: undefined }));
                                  }}
                                />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="center">
                            <CalendarComponent
                              mode="range"
                              defaultMonth={filters.dateRange?.from}
                              selected={{
                                from: filters.dateRange?.from,
                                to: filters.dateRange?.to,
                              }}
                              onSelect={(range) => {
                                if (range?.from && range?.to) {
                                  handleDateRangeChange(range);
                                }
                              }}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <SheetFooter className="mt-6 flex gap-2 justify-between sm:justify-between">
                      <Button variant="outline" onClick={clearFilters}>
                        {language === 'pt' ? 'Limpar Filtros' : 'Clear Filters'}
                      </Button>
                      <SheetClose asChild>
                        <Button>
                          {language === 'pt' ? 'Aplicar Filtros' : 'Apply Filters'}
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                
                <Sheet open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
                  <SheetTrigger asChild>
                    <Button className="h-10 flex items-center gap-1">
                      <FilePlus className="h-4 w-4" />
                      {language === 'pt' ? 'Novo Registro' : 'New Record'}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>
                        {language === 'pt' ? 'Criar Novo Registro Médico' : 'Create New Medical Record'}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <NewRecordForm 
                        onSuccess={handleRecordCreated} 
                        onCancel={() => setIsNewRecordOpen(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <RecordsList filters={filters} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecordsPage;
