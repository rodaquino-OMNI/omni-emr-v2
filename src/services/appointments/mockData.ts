
import { Appointment, AppointmentType, AppointmentStatus } from './types';

// Generate a set of mock appointments
export const generateMockAppointments = (): Appointment[] => {
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      patientId: "1",
      patientName: "John Doe",
      providerId: "101",
      providerName: "Dr. Sarah Chen",
      title: "Follow-up Consultation",
      notes: "Check progress on medication",
      date: "2023-11-15",
      time: "09:00",
      duration: 30,
      location: "Room 203",
      type: "in-person",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "2",
      patientId: "2",
      patientName: "Emma Thompson",
      providerId: "102",
      providerName: "Dr. Michael Rodriguez",
      title: "Medication Review",
      notes: "Adjust medication dosage if needed",
      date: "2023-11-15",
      time: "10:00",
      duration: 15,
      location: "Room 105",
      type: "in-person",
      status: "scheduled",
      reminder_sent: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "3",
      patientId: "3",
      patientName: "Michael Johnson",
      providerId: "103",
      providerName: "Dr. Lisa Wilson",
      title: "Physical Therapy",
      notes: "Follow-up on exercise routine",
      date: "2023-11-15",
      time: "11:30",
      duration: 45,
      location: "Therapy Room A",
      type: "in-person",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "4",
      patientId: "4",
      patientName: "Sophia Martinez",
      providerId: "101",
      providerName: "Dr. Sarah Chen",
      title: "Diagnostic Imaging",
      notes: "Review MRI results",
      date: "2023-11-16",
      time: "09:30",
      duration: 60,
      location: "Radiology Dept.",
      type: "in-person",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "5",
      patientId: "1",
      patientName: "John Doe",
      providerId: "101",
      providerName: "Dr. Sarah Chen",
      title: "Telemedicine Consultation",
      notes: "Discuss treatment progress",
      date: "2023-11-17",
      time: "14:00",
      duration: 30,
      location: "Virtual",
      type: "telemedicine",
      status: "scheduled",
      reminder_sent: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "6",
      patientId: "5",
      patientName: "Robert Chen",
      providerId: "102",
      providerName: "Dr. Michael Rodriguez",
      title: "Post-Surgery Check",
      notes: "Evaluate recovery progress",
      date: "2023-11-18",
      time: "11:00",
      duration: 20,
      location: "Room 110",
      type: "in-person",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "7",
      patientId: "6",
      patientName: "Olivia Wilson",
      providerId: "103",
      providerName: "Dr. Lisa Wilson",
      title: "Phone Consultation",
      notes: "Discuss test results",
      date: "2023-11-20",
      time: "15:30",
      duration: 15,
      location: "Phone",
      type: "phone",
      status: "scheduled",
      reminder_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  return mockAppointments;
};

// Export a shared instance of mock appointments
export const mockAppointments = generateMockAppointments();
