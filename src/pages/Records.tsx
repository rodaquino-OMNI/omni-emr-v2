import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, FileText, Calendar } from 'lucide-react';
import { recordService } from '@/services/recordService';
import { MedicalRecord, RecordTypeOption, RecordFilters } from '@/types/medicalRecordTypes';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar as CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { addDays } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Records = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user } = useAuth();
  
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RecordFilters>({
    searchTerm: '',
    typeFilter: '',
    dateRange: undefined,
    statusFilter: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const recordTypes: RecordTypeOption[] = [
    { value: 'lab', label: language === 'pt' ? 'Resultados de Laboratório' : 'Lab Results' },
    { value: 'imaging', label: language === 'pt' ? 'Imagens' : 'Imaging' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimentos' : 'Procedures' },
    { value: 'visit', label: language === 'pt' ? 'Notas de Visita' : 'Visit Notes' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' },
  ];

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedRecords = await recordService.getRecords({
        searchTerm: debouncedSearchTerm,
        typeFilter: filters.typeFilter,
        dateRange: dateRange,
        statusFilter: filters.statusFilter,
        page: currentPage,
        limit: itemsPerPage
      });
      
      setRecords(fetchedRecords.records);
      setTotalItems(fetchedRecords.total);
    } catch (err: any) {
      console.error("Error fetching records:", err);
      setError(t('fetchRecordsError') || 'Failed to fetch records.');
      toast.error(t('fetchRecordsError') || 'Failed to fetch records.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filters, currentPage, itemsPerPage, t, dateRange]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
    setCurrentPage(1);
  };
  
  const handleTypeFilterChange = (value: string) => {
    setFilters(prev => ({ ...prev, typeFilter: value }));
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirmDeleteRecord') || 'Are you sure you want to delete this record?')) {
      try {
        await recordService.deleteRecord(id);
        setRecords(prev => prev.filter(record => record.id !== id));
        toast.success(t('recordDeleted') || 'Record deleted successfully.');
        fetchRecords();
      } catch (err: any) {
        console.error("Error deleting record:", err);
        toast.error(t('deleteRecordError') || 'Failed to delete record.');
      }
    }
  };
  
  const filterByDateRange = (records: MedicalRecord[], dateRange: { from: Date; to: Date }) => {
    if (!dateRange?.from || !dateRange?.to) {
      return records;
    }
    
    return records.filter(record => {
      const recordDate = new Date(record.date);
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      
      return recordDate >= fromDate && recordDate <= addDays(toDate, 1);
    });
  };
  
  const filteredByDate = filterByDateRange(records, {
    from: dateRange?.from || new Date(),
    to: dateRange?.to || new Date()
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('clinicalRecords') || 'Clinical Records'}</h2>
        <Button onClick={() => navigate('/clinical-documentation')}>
          <Plus className="mr-2 h-4 w-4" />
          {t('addRecord') || 'Add Record'}
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t('searchAndFilter') || 'Search and Filter'}</CardTitle>
          <CardDescription>
            {t('searchRecordsByTitleAndType') || 'Search records by title, filter by type and date.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">{t('search') || 'Search'}</Label>
              <Input
                type="search"
                id="search"
                placeholder={t('searchByTitle') || 'Search by title...'}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <Label htmlFor="type">{t('recordType') || 'Record Type'}</Label>
              <Select
                onValueChange={handleTypeFilterChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('allTypes') || 'All Types'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('allTypes') || 'All Types'}</SelectItem>
                  {recordTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t('filterByDate') || 'Filter by date'}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>{t('pickDateRange') || "Pick a date range"}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <div className="border rounded-md p-2">
                    <div className="react-datepicker__header">
                      <div className="react-datepicker__current-month">
                        {t('selectRange') || "Select a date range"}
                      </div>
                    </div>
                    <div className="react-datepicker__month-container">
                      <div className="react-datepicker__month">
                        <div className="react-datepicker__week">
                          <div className="react-datepicker__day-names">
                            <div>{t('sun') || "Sun"}</div>
                            <div>{t('mon') || "Mon"}</div>
                            <div>{t('tue') || "Tue"}</div>
                            <div>{t('wed') || "Wed"}</div>
                            <div>{t('thu') || "Thu"}</div>
                            <div>{t('fri') || "Fri"}</div>
                            <div>{t('sat') || "Sat"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__view">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="grid gap-2">
                        <div className="relative">
                          <div className="absolute top-0.5 left-0.5 size-4">
                            <CalendarIcon className="h-4 w-4" />
                          </div>
                          <div className="ml-6">
                            <div className="focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 relative overflow-hidden rounded-md border border-input bg-background text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:bg-popover data-[state=open]:text-popover-foreground">
                              <div className="p-2">
                                <div className="react-datepicker">
                                  <div className="react-datepicker__navigation react-datepicker__navigation--previous">
                                    <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
                                      {"<"}
                                    </span>
                                  </div>
                                  <div className="react-datepicker__navigation react-datepicker__navigation--next">
                                    <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">
                                      {">"}
                                    </span>
                                  </div>
                                  <div className="react-datepicker__month-container">
                                    <div className="react-datepicker__month">
                                      <div className="react-datepicker__week">
                                        <div className="react-datepicker__day-names">
                                          <div>{t('sun') || "Sun"}</div>
                                          <div>{t('mon') || "Mon"}</div>
                                          <div>{t('tue') || "Tue"}</div>
                                          <div>{t('wed') || "Wed"}</div>
                                          <div>{t('thu') || "Thu"}</div>
                                          <div>{t('fri') || "Fri"}</div>
                                          <div>{t('sat') || "Sat"}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="react-datepicker__tab-loop">
                                    <div tabIndex={-1} />
                                  </div>
                                  <div className="react-datepicker__portal">
                                    <div className="react-datepicker__month-container">
                                      <div className="react-datepicker__month">
                                        <div className="react-datepicker__week">
                                          <div className="react-datepicker__day-names">
                                            <div>{t('sun') || "Sun"}</div>
                                            <div>{t('mon') || "Mon"}</div>
                                            <div>{t('tue') || "Tue"}</div>
                                            <div>{t('wed') || "Wed"}</div>
                                            <div>{t('thu') || "Thu"}</div>
                                            <div>{t('fri') || "Fri"}</div>
                                            <div>{t('sat') || "Sat"}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
                              <div>{t('fri') || "Fri"}</div>
                              <div>{t('sat') || "Sat"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="react-datepicker__tab-loop">
                      <div tabIndex={-1} />
                    </div>
                    <div className="react-datepicker__portal">
                      <div className="react-datepicker__month-container">
                        <div className="react-datepicker__month">
                          <div className="react-datepicker__week">
                            <div className="react-datepicker__day-names">
                              <div>{t('sun') || "Sun"}</div>
                              <div>{t('mon') || "Mon"}</div>
                              <div>{t('tue') || "Tue"}</div>
                              <div>{t('wed') || "Wed"}</div>
                              <div>{t('thu') || "Thu"}</div>
