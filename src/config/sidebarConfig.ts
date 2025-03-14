
import { LucideIcon, Home, Users, FileText, Pill, Calendar, MessageSquare, Video, HelpCircle, ClipboardList, Bell, ListChecks, Activity, Droplet } from 'lucide-react';

export type SidebarItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  translationKey: string;
  permissionRequired?: string;
  priority: number;
  children?: Omit<SidebarItem, 'children'>[];
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
    name: 'Clinical Documentation',
    path: '/records',
    icon: FileText,
    translationKey: 'records',
    priority: 5
  },
  {
    name: 'Vital Signs',
    path: '/vitals',
    icon: Activity,
    translationKey: 'vitals',
    priority: 6
  },
  {
    name: 'Fluid Balance',
    path: '/fluid-balance',
    icon: Droplet, 
    translationKey: 'fluidBalance',
    priority: 7
  },
  {
    name: 'Medications',
    path: '/medications',
    icon: Pill,
    translationKey: 'medications',
    priority: 8
  },
  {
    name: 'Prescriptions',
    path: '/prescriptions',
    icon: ClipboardList,
    translationKey: 'prescriptions',
    priority: 9
  },
  {
    name: 'Messages',
    path: '/messages',
    icon: MessageSquare,
    translationKey: 'messages',
    priority: 10
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    translationKey: 'notifications',
    priority: 11
  },
  {
    name: 'Telemedicine',
    path: '/telemedicine',
    icon: Video,
    translationKey: 'telemedicine',
    permissionRequired: 'telemedicine',
    priority: 12
  },
  {
    name: 'Help & Support',
    path: '/help',
    icon: HelpCircle,
    translationKey: 'help',
    priority: 13
  }
];
