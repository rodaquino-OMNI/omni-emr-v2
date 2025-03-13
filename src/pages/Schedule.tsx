
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarPlus, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import AppointmentsList from '../components/schedule/AppointmentsList';
import ScheduleConsultationForm from '../components/schedule/ScheduleConsultationForm';
import { getAppointmentsByDate } from '@/services/appointmentService';

const SchedulePage = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date>(new Date());
  const [isScheduleFormOpen, setIsScheduleFormOpen] = useState(false);
  
  // Fetch appointments for the selected date
  const { 
    data: appointments = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['appointments', date ? format(date, 'yyyy-MM-dd') : ''],
    queryFn: () => date ? getAppointmentsByDate(format(date, 'yyyy-MM-dd')) : Promise.resolve([]),
    enabled: !!date,
  });
  
  // Handle month navigation
  const handlePreviousMonth = () => {
    const previousMonth = new Date(month);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    setMonth(previousMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setMonth(nextMonth);
  };
  
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Handle successful appointment creation
  const handleScheduleSuccess = () => {
    setIsScheduleFormOpen(false);
    refetch();
    toast({
      title: t('appointmentScheduled'),
      description: t('appointmentScheduledSuccess'),
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
              <h1 className="text-2xl font-semibold">{t('schedule')}</h1>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('refresh')}
                </Button>
                
                <Sheet open={isScheduleFormOpen} onOpenChange={setIsScheduleFormOpen}>
                  <SheetTrigger asChild>
                    <Button className="h-9 text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 w-fit">
                      <CalendarPlus className="h-4 w-4" />
                      {t('newAppointment')}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>{t('scheduleConsultation')}</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <ScheduleConsultationForm 
                        onSuccess={handleScheduleSuccess} 
                        onCancel={() => setIsScheduleFormOpen(false)} 
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <div className="grid md:grid-cols-[350px_1fr] gap-6">
              <div className="glass-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={handlePreviousMonth}
                    className="p-1 rounded-full hover:bg-secondary"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h2 className="font-medium">{formatMonthYear(month)}</h2>
                  <button 
                    onClick={handleNextMonth}
                    className="p-1 rounded-full hover:bg-secondary"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  month={month}
                  onMonthChange={setMonth}
                  className="rounded-md border pointer-events-auto"
                />
              </div>
              
              <div className="glass-card p-6">
                <Tabs defaultValue="appointments">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">
                      {date ? format(date, 'EEEE, MMMM d, yyyy') : t('selectDate')}
                    </h2>
                    <TabsList>
                      <TabsTrigger value="appointments">{t('appointments')}</TabsTrigger>
                      <TabsTrigger value="reminders">{t('reminders')}</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="appointments" className="mt-0">
                    {isLoading ? (
                      <div className="py-10 text-center text-muted-foreground animate-pulse">
                        {t('loading')}...
                      </div>
                    ) : (
                      <AppointmentsList selectedDate={date} />
                    )}
                  </TabsContent>
                  
                  <TabsContent value="reminders" className="mt-0">
                    {/* Reminders tab content - would contain scheduled reminders */}
                    <div className="text-center py-8 text-muted-foreground">
                      <p>{t('noRemindersScheduled')}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchedulePage;
