
import { LucideIcon, Home, Users, FileText, Pill, Calendar, MessageSquare, Video, HelpCircle, ClipboardList, Bell, ListChecks } from 'lucide-react';

export type SidebarItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  translationKey: string;
  permissionRequired?: string;
  priority: number;
};

export const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    translationKey: 'dashboard',
    priority: 1
  },
  {
    name: 'Patients',
    path: '/patients',
    icon: Users,
    translationKey: 'patients',
    priority: 2
  },
  {
    name: 'Schedule',
    path: '/schedule',
    icon: Calendar,
    translationKey: 'schedule',
    permissionRequired: 'view_schedule',
    priority: 3
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: ListChecks,
    translationKey: 'tasks',
    priority: 4
  },
  {
    name: 'Records',
    path: '/records',
    icon: FileText,
    translationKey: 'records',
    priority: 5
  },
  {
    name: 'Medications',
    path: '/medications',
    icon: Pill,
    translationKey: 'medications',
    priority: 6
  },
  {
    name: 'Prescriptions',
    path: '/prescriptions',
    icon: ClipboardList,
    translationKey: 'prescriptions',
    priority: 7
  },
  {
    name: 'Messages',
    path: '/messages',
    icon: MessageSquare,
    translationKey: 'messages',
    priority: 8
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    translationKey: 'notifications',
    priority: 9
  },
  {
    name: 'Telemedicine',
    path: '/telemedicine',
    icon: Video,
    translationKey: 'telemedicine',
    permissionRequired: 'telemedicine',
    priority: 10
  },
  {
    name: 'Help & Support',
    path: '/help',
    icon: HelpCircle,
    translationKey: 'help',
    priority: 11
  }
];
