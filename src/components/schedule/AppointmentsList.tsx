
import React from 'react';
import { cn } from '@/lib/utils';
import AppointmentCard, { Appointment } from './AppointmentCard';

type AppointmentsListProps = {
  className?: string;
  selectedDate?: Date;
  patientId?: string;
  limit?: number;
};

// Sample appointments data
const sampleAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "John Doe",
    title: "Follow-up Consultation",
    date: "2023-11-15",
    time: "09:00",
    duration: 30,
    provider: "Dr. Sarah Chen",
    location: "Room 203",
    status: "scheduled"
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Emma Thompson",
    title: "Medication Review",
    date: "2023-11-15",
    time: "10:00",
    duration: 15,
    provider: "Dr. Michael Rodriguez",
    location: "Room 105",
    status: "scheduled"
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Michael Johnson",
    title: "Physical Therapy",
    date: "2023-11-15",
    time: "11:30",
    duration: 45,
    provider: "Dr. Lisa Wilson",
    location: "Therapy Room A",
    status: "scheduled"
  },
  {
    id: "4",
    patientId: "4",
    patientName: "Sophia Martinez",
    title: "Diagnostic Imaging",
    date: "2023-11-16",
    time: "09:30",
    duration: 60,
    provider: "Dr. James Parker",
    location: "Radiology Dept.",
    status: "scheduled"
  },
  {
    id: "5",
    patientId: "1",
    patientName: "John Doe",
    title: "Discharge Planning",
    date: "2023-11-17",
    time: "14:00",
    duration: 30,
    provider: "Dr. Sarah Chen",
    location: "Room 203",
    status: "scheduled"
  },
  {
    id: "6",
    patientId: "5",
    patientName: "Robert Chen",
    title: "Post-Surgery Check",
    date: "2023-11-18",
    time: "11:00",
    duration: 20,
    provider: "Dr. Emily Johnson",
    location: "Room 110",
    status: "scheduled"
  },
  {
    id: "7",
    patientId: "6",
    patientName: "Olivia Wilson",
    title: "Initial Assessment",
    date: "2023-11-20",
    time: "15:30",
    duration: 60,
    provider: "Dr. David Brown",
    location: "Room 203",
    status: "scheduled"
  }
];

const AppointmentsList = ({ className, selectedDate, patientId, limit }: AppointmentsListProps) => {
  // Filter appointments by selected date (if provided)
  const getFilteredAppointments = () => {
    let filtered = [...sampleAppointments];
    
    if (patientId) {
      filtered = filtered.filter(appointment => appointment.patientId === patientId);
    }
    
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(appointment => appointment.date === dateString);
    }
    
    // Sort by time
    filtered.sort((a, b) => a.time.localeCompare(b.time));
    
    if (limit && filtered.length > limit) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };
  
  const filteredAppointments = getFilteredAppointments();

  return (
    <div className={cn("space-y-3", className)}>
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map(appointment => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No appointments scheduled for this day.
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
