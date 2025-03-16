
import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Calendar } from 'lucide-react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';

const SchedulePage = () => {
  const { language } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState([
    { id: 1, time: '9:00 AM', patient: 'John Doe', type: 'Check-up' },
    { id: 2, time: '11:00 AM', patient: 'Jane Smith', type: 'Follow-up' },
  ]);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    time: '',
    patient: '',
    type: '',
    notes: '',
  });

  useEffect(() => {
    // Simulate fetching appointments for the selected date
    // In a real application, you would fetch this data from an API
    console.log('Fetching appointments for:', date);
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: string, name: string) => {
    setNewAppointment({ ...newAppointment, [name]: e });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submitting the new appointment
    const newId = appointments.length > 0 ? appointments[appointments.length - 1].id + 1 : 1;
    setAppointments([...appointments, { id: newId, ...newAppointment }]);
    setIsNewAppointmentModalOpen(false);
    setNewAppointment({ time: '', patient: '', type: '', notes: '' });
    toast.success(language === 'pt' ? 'Consulta agendada com sucesso!' : 'Appointment scheduled successfully!');
  };

  const handleDelete = (id: number) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    toast.success(language === 'pt' ? 'Consulta cancelada com sucesso!' : 'Appointment cancelled successfully!');
  };

  // This handler properly handles the date selection from the Calendar component
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  useEffect(() => {
    // Simulate loading appointments
    setTimeout(() => {
      // Simulate an error
      toast.error(
        language === 'pt' 
          ? 'Falha ao carregar consultas' 
          : 'Failed to load appointments'
      );
    }, 1500);
  }, [language]);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">
                {language === 'pt' ? 'Agendamentos' : 'Schedule'}
              </h1>
              <Button onClick={() => setIsNewAppointmentModalOpen(true)}>
                {language === 'pt' ? '+ Novo Agendamento' : '+ New Appointment'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4">
                <h2 className="text-lg font-semibold mb-4">{language === 'pt' ? 'Calendário' : 'Calendar'}</h2>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>{language === 'pt' ? 'Selecionar data' : 'Select date'}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="border rounded-md p-4">
                <h2 className="text-lg font-semibold mb-4">{language === 'pt' ? 'Agendamentos do Dia' : 'Today\'s Appointments'}</h2>
                {appointments.length > 0 ? (
                  <ul className="space-y-2">
                    {appointments.map(appointment => (
                      <li key={appointment.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <div className="font-semibold">{appointment.time}</div>
                          <div className="text-sm">{appointment.patient} - {appointment.type}</div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(appointment.id)}>
                          {language === 'pt' ? 'Cancelar' : 'Cancel'}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">{language === 'pt' ? 'Nenhum agendamento para hoje.' : 'No appointments for today.'}</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* New Appointment Modal */}
      {isNewAppointmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">{language === 'pt' ? 'Novo Agendamento' : 'New Appointment'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="time">{language === 'pt' ? 'Horário' : 'Time'}</Label>
                <Input type="time" id="time" name="time" value={newAppointment.time} onChange={handleInputChange} required className="w-full" />
              </div>
              <div>
                <Label htmlFor="patient">{language === 'pt' ? 'Paciente' : 'Patient'}</Label>
                <Input type="text" id="patient" name="patient" value={newAppointment.patient} onChange={handleInputChange} required className="w-full" />
              </div>
              <div>
                <Label>{language === 'pt' ? 'Tipo' : 'Type'}</Label>
                <Select onValueChange={(e) => handleSelectChange(e, 'type')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={language === 'pt' ? "Selecionar tipo" : "Select type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Check-up">{language === 'pt' ? 'Check-up' : 'Check-up'}</SelectItem>
                    <SelectItem value="Follow-up">{language === 'pt' ? 'Acompanhamento' : 'Follow-up'}</SelectItem>
                    <SelectItem value="Consultation">{language === 'pt' ? 'Consulta' : 'Consultation'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">{language === 'pt' ? 'Notas' : 'Notes'}</Label>
                <Textarea id="notes" name="notes" value={newAppointment.notes} onChange={handleInputChange} className="w-full" />
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="ghost" onClick={() => setIsNewAppointmentModalOpen(false)} className="mr-2">
                  {language === 'pt' ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button type="submit">{language === 'pt' ? 'Agendar' : 'Schedule'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
