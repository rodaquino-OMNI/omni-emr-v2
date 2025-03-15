
import { LucideIcon, Home, Users, FileText, Pill, Calendar, MessageSquare, Video, HelpCircle, ClipboardList, Bell, ListChecks, Activity, Droplet, Settings, BarChart, Stethoscope, BookUser, FileHeart, FlaskConical, ClipboardCheck } from 'lucide-react';

export type SidebarItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  translationKey: string;
  permissionRequired?: string;
  priority: number;
  roles?: string[]; // Specific roles that can see this item
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
    name: 'Visit Notes',
    path: '/visit-notes',
    icon: ClipboardCheck,
    translationKey: 'visitNotes',
    permissionRequired: 'view_records',
    priority: 3
  },
  {
    name: 'Schedule',
    path: '/schedule',
    icon: Calendar,
    translationKey: 'schedule',
    permissionRequired: 'view_schedule',
    priority: 4
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: ListChecks,
    translationKey: 'tasks',
    priority: 5
  },
  {
    name: 'Clinical Documentation',
    path: '/records',
    icon: FileText,
    translationKey: 'records',
    permissionRequired: 'view_records',
    priority: 6
  },
  {
    name: 'Vital Signs',
    path: '/vitals',
    icon: Activity,
    translationKey: 'vitals',
    permissionRequired: 'view_vitals',
    priority: 7
  },
  {
    name: 'Fluid Balance',
    path: '/fluid-balance',
    icon: Droplet, 
    translationKey: 'fluidBalance',
    permissionRequired: 'manage_fluid_balance',
    priority: 8
  },
  {
    name: 'Medications',
    path: '/medications',
    icon: Pill,
    translationKey: 'medications',
    permissionRequired: 'view_medications',
    priority: 9
  },
  {
    name: 'Prescriptions',
    path: '/prescriptions',
    icon: ClipboardList,
    translationKey: 'prescriptions',
    permissionRequired: 'view_prescriptions',
    priority: 10
  },
  {
    name: 'Messages',
    path: '/messages',
    icon: MessageSquare,
    translationKey: 'messages',
    priority: 11
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    translationKey: 'notifications',
    priority: 12
  },
  {
    name: 'Telemedicine',
    path: '/telemedicine',
    icon: Video,
    translationKey: 'telemedicine',
    permissionRequired: 'telemedicine',
    priority: 13
  },
  {
    name: 'Orders',
    path: '/orders',
    icon: ClipboardList,
    translationKey: 'orders',
    permissionRequired: 'view_orders',
    priority: 14
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart,
    translationKey: 'analytics',
    permissionRequired: 'view_analytics',
    priority: 15,
    roles: ['admin', 'doctor', 'system_administrator']
  },
  {
    name: 'Help & Support',
    path: '/help',
    icon: HelpCircle,
    translationKey: 'help',
    priority: 16
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    translationKey: 'settings',
    priority: 17
  }
];
