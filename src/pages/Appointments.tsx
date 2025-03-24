import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isToday, isTomorrow, isThisWeek, isAfter } from 'date-fns';
import { Calendar, Clock, Filter, Plus, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import ErrorBoundary from '@/components/ErrorBoundary';

// Types
interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

// Mock data
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientId: 'p1',
    patientName: 'John Doe',
    providerId: 'dr1',
    providerName: 'Dr. Smith',
    date: '2025-03-21',
    time: '09:00',
    duration: 30,
    type: 'Check-up',
    status: 'scheduled'
  },
  {
    id: '2',
    patientId: 'p2',
    patientName: 'Jane Smith',
    providerId: 'dr2',
    providerName: 'Dr. Johnson',
    date: '2025-03-21',
    time: '10:30',
    duration: 45,
    type: 'Follow-up',
    status: 'scheduled'
  },
  {
    id: '3',
    patientId: 'p3',
    patientName: 'Robert Brown',
    providerId: 'dr1',
    providerName: 'Dr. Smith',
    date: '2025-03-22',
    time: '14:00',
    duration: 60,
    type: 'Consultation',
    status: 'scheduled'
  },
  {
    id: '4',
    patientId: 'p4',
    patientName: 'Emily Johnson',
    providerId: 'dr3',
    providerName: 'Dr. Williams',
    date: '2025-03-25',
    time: '11:15',
    duration: 30,
    type: 'Check-up',
    status: 'scheduled'
  },
  {
    id: '5',
    patientId: 'p5',
    patientName: 'Michael Davis',
    providerId: 'dr2',
    providerName: 'Dr. Johnson',
    date: '2025-03-26',
    time: '15:30',
    duration: 45,
    type: 'Follow-up',
    status: 'scheduled'
  }
];

// Mock API function with optimized query
const fetchAppointments = async (): Promise<Appointment[]> => {
  // Simulate API call with 500ms delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would be a Supabase query with proper indexing
  // const { data, error } = await supabase
  //   .from('appointments')
  //   .select('id, patient_id, patient:patients(name), provider_id, provider:providers(name), date, time, duration, type, status, notes')
  //   .order('date', { ascending: true });
  
  return MOCK_APPOINTMENTS;
};

const AppointmentsList: React.FC<{
  appointments: Appointment[];
  onSelect: (appointment: Appointment) => void;
  selectedId?: string;
}> = React.memo(({ appointments, onSelect, selectedId }) => {
  // Group appointments by date for better organization
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  if (Object.keys(appointmentsByDate).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No appointments found
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      {Object.entries(appointmentsByDate).map(([date, dateAppointments]) => (
        <div key={date} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {dateAppointments.map(appointment => (
            <div
              key={appointment.id}
              className={`p-3 rounded-md border cursor-pointer transition-colors ${
                selectedId === appointment.id
                  ? 'bg-primary/10 border-primary/20'
                  : 'hover:bg-muted'
              }`}
              onClick={() => onSelect(appointment)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.time}</span>
                </div>
                <Badge variant="outline">{appointment.type}</Badge>
              </div>
              <div className="mt-1 font-medium">{appointment.patientName}</div>
              <div className="text-sm text-muted-foreground">{appointment.providerName}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

const AppointmentDetails: React.FC<{
  appointment: Appointment | null;
  onEdit?: () => void;
  onCancel?: () => void;
}> = React.memo(({ appointment, onEdit, onCancel }) => {
  const { t } = useTranslation();
  
  if (!appointment) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {t('selectAppointmentToViewDetails')}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('patient')}</h3>
          <p className="text-lg font-medium">{appointment.patientName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('provider')}</h3>
          <p className="text-lg font-medium">{appointment.providerName}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('dateAndTime')}</h3>
          <p className="text-lg font-medium">
            {format(parseISO(`${appointment.date}T${appointment.time}`), 'PPP')} at {appointment.time}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('duration')}</h3>
          <p className="text-lg font-medium">{appointment.duration} minutes</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('type')}</h3>
          <p className="text-lg font-medium">{appointment.type}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('status')}</h3>
          <p className="text-lg font-medium">{appointment.status}</p>
        </div>
      </div>
      
      {appointment.notes && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('notes')}</h3>
          <p className="text-base">{appointment.notes}</p>
        </div>
      )}
      
      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            {t('cancelAppointment')}
          </Button>
        )}
        {onEdit && (
          <Button onClick={onEdit}>
            {t('editAppointment')}
          </Button>
        )}
      </div>
    </div>
  );
});

const NewAppointmentForm: React.FC<{
  onSubmit: (data: any) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    patientName: '',
    providerName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
    duration: '30',
    type: 'Check-up',
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        date: format(date, 'yyyy-MM-dd')
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">{t('patient')}</Label>
          <Input
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="providerName">{t('provider')}</Label>
          <Input
            id="providerName"
            name="providerName"
            value={formData.providerName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>{t('date')}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(parseISO(formData.date), 'PPP') : t('selectDate')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.date ? parseISO(formData.date) : undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">{t('time')}</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">{t('duration')}</Label>
          <Select name="duration" value={formData.duration} onValueChange={(value) => handleInputChange({ target: { name: 'duration', value } } as any)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectDuration')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">{t('type')}</Label>
          <Select name="type" value={formData.type} onValueChange={(value) => handleInputChange({ target: { name: 'type', value } } as any)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Check-up">Check-up</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Procedure">Procedure</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">{t('notes')}</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={3}
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit">{t('createAppointment')}</Button>
      </DialogFooter>
    </form>
  );
};

const Appointments: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);

  // Fetch appointments with React Query for efficient caching
  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: fetchAppointments,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Filter appointments based on search term and selected date
  const filteredAppointments = React.useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch = searchTerm === '' ||
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const appointmentDate = parseISO(`${appointment.date}T${appointment.time}`);
      
      let matchesTab = true;
      if (activeTab === 'today') {
        matchesTab = isToday(appointmentDate);
      } else if (activeTab === 'tomorrow') {
        matchesTab = isTomorrow(appointmentDate);
      } else if (activeTab === 'upcoming') {
        matchesTab = isAfter(appointmentDate, new Date());
      } else if (activeTab === 'week') {
        matchesTab = isThisWeek(appointmentDate);
      }
      
      const matchesDate = !selectedDate || appointment.date === format(selectedDate, 'yyyy-MM-dd');
      
      return matchesSearch && matchesTab && matchesDate;
    });
  }, [appointments, searchTerm, activeTab, selectedDate]);

  // Handle appointment selection
  const handleAppointmentSelect = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  // Handle form submission for new appointment
  const handleSubmit = (formData: any) => {
    // In a real application, this would call an API to create the appointment
    toast({
      title: t('appointmentCreated'),
      description: `${formData.patientName} - ${formData.date} ${formData.time}`,
    });
    
    setIsNewAppointmentDialogOpen(false);
    
    // Refetch appointments to include the new one
    // In a real application, this would be handled by the mutation's onSuccess callback
    setTimeout(() => refetch(), 500);
  };

  // Handle appointment cancellation
  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;
    
    // In a real application, this would call an API to cancel the appointment
    toast({
      title: t('appointmentCancelled'),
      description: `${selectedAppointment.patientName} - ${selectedAppointment.date} ${selectedAppointment.time}`,
    });
    
    // Refetch appointments to update the list
    setTimeout(() => {
      setSelectedAppointment(null);
      refetch();
    }, 500);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <ErrorBoundary>
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-primary" />
                  {t('appointments')}
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={t('searchAppointments')}
                      className="pl-8 w-full sm:w-[200px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : t('selectDate')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button onClick={() => setIsNewAppointmentDialogOpen(true)} className="gap-1">
                    <Plus className="h-4 w-4" />
                    {t('newAppointment')}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>{t('appointmentsList')}</CardTitle>
                      <CardDescription>
                        {filteredAppointments.length} {t('appointmentsFound')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mx-4 mb-2">
                          <TabsTrigger value="today">{t('today')}</TabsTrigger>
                          <TabsTrigger value="tomorrow">{t('tomorrow')}</TabsTrigger>
                          <TabsTrigger value="week">{t('thisWeek')}</TabsTrigger>
                          <TabsTrigger value="upcoming">{t('all')}</TabsTrigger>
                        </TabsList>
                        
                        <div className="px-4 pb-4">
                          {isLoading ? (
                            <div className="flex justify-center py-8">
                              <LoadingSpinner />
                            </div>
                          ) : (
                            <AppointmentsList
                              appointments={filteredAppointments}
                              onSelect={handleAppointmentSelect}
                              selectedId={selectedAppointment?.id}
                            />
                          )}
                        </div>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>
                        {selectedAppointment ? t('appointmentDetails') : t('appointmentInformation')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AppointmentDetails
                        appointment={selectedAppointment}
                        onCancel={handleCancelAppointment}
                        onEdit={() => toast({
                          title: t('notImplemented'),
                          description: t('featureComingSoon')
                        })}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </ErrorBoundary>
        </main>
      </div>
      
      <Dialog open={isNewAppointmentDialogOpen} onOpenChange={setIsNewAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('newAppointment')}</DialogTitle>
            <DialogDescription>
              {t('fillAppointmentDetails')}
            </DialogDescription>
          </DialogHeader>
          <NewAppointmentForm
            onSubmit={handleSubmit}
            onCancel={() => setIsNewAppointmentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
