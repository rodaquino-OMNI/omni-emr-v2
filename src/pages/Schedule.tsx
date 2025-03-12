
import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Calendar } from '@/components/ui/calendar';
import { CalendarPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import AppointmentsList from '../components/schedule/AppointmentsList';

const SchedulePage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date>(new Date());
  
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

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">Schedule</h1>
              
              <button className="h-9 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1 w-fit">
                <CalendarPlus className="h-4 w-4" />
                New Appointment
              </button>
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
                  className="rounded-md border"
                />
              </div>
              
              <div className="glass-card p-6">
                <h2 className="text-lg font-medium mb-4">
                  {date ? date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Select a date'}
                </h2>
                
                <AppointmentsList selectedDate={date} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchedulePage;
