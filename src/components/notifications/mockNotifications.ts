
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'appointment' | 'medication' | 'alert';
  read: boolean;
  important: boolean;
  archived: boolean;
  timestamp: string;
}

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Smith tomorrow at 10:00 AM.',
    type: 'appointment',
    read: false,
    important: true,
    archived: false,
    timestamp: '2023-06-15T08:00:00Z'
  },
  {
    id: '2',
    title: 'Medication Alert',
    message: 'Patient John Doe has missed his medication schedule.',
    type: 'medication',
    read: false,
    important: true,
    archived: false,
    timestamp: '2023-06-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'System Update',
    message: 'The system will undergo maintenance tonight from 2 AM to 4 AM.',
    type: 'system',
    read: true,
    important: false,
    archived: false,
    timestamp: '2023-06-13T11:45:00Z'
  },
  {
    id: '4',
    title: 'New Patient Record',
    message: 'A new patient record has been created for Jane Smith.',
    type: 'system',
    read: true,
    important: false,
    archived: false,
    timestamp: '2023-06-12T09:15:00Z'
  },
  {
    id: '5',
    title: 'Critical Alert',
    message: 'Patient Sarah Johnson needs immediate attention.',
    type: 'alert',
    read: false,
    important: true,
    archived: false,
    timestamp: '2023-06-11T22:30:00Z'
  },
  {
    id: '6',
    title: 'Schedule Change',
    message: 'Your shift has been changed for next week.',
    type: 'system',
    read: true,
    important: false,
    archived: true,
    timestamp: '2023-06-10T16:20:00Z'
  },
  {
    id: '7',
    title: 'Task Assigned',
    message: 'You have been assigned a new task by Dr. Johnson.',
    type: 'system',
    read: false,
    important: false,
    archived: false,
    timestamp: '2023-06-09T10:45:00Z'
  }
];
