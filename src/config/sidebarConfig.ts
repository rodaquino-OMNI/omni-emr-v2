import { LucideIcon, Home, Users, FileText, Pill, Calendar, MessageSquare, Video, HelpCircle, ClipboardList, Bell, ListChecks, Activity, Droplet, Settings, BarChart, Stethoscope, BookUser, FileHeart, FlaskConical, ClipboardCheck, Siren, Shield, Package } from 'lucide-react';

export type SidebarItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  translationKey: string;
  permissionRequired?: string;
  functionBlockRequired?: string; // New property to link to function blocks
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
  // Emergency Care - add with high priority
  {
    name: 'Emergency Care',
    path: '/emergency-care',
    icon: Siren,
    translationKey: 'emergencyCare',
    permissionRequired: 'view_emergency',
    functionBlockRequired: 'emergency_care',
    priority: 2,
    roles: ['doctor', 'nurse', 'administrative']
  },
  // Nurse-focused items - moved to top positions with higher priority for nurse role
  {
    name: 'Medication Administration',
    path: '/medications',
    icon: Pill,
    translationKey: 'medicationAdministration',
    permissionRequired: 'administer_medications',
    functionBlockRequired: 'medication_management',
    priority: 3,
    roles: ['nurse', 'doctor']
  },
  {
    name: 'Fluid Balance',
    path: '/fluid-balance',
    icon: Droplet, 
    translationKey: 'fluidBalance',
    permissionRequired: 'manage_fluid_balance',
    functionBlockRequired: 'fluid_balance',
    priority: 4,
    roles: ['nurse', 'doctor']
  },
  {
    name: 'Visit Notes',
    path: '/visit-notes',
    icon: ClipboardCheck,
    translationKey: 'visitNotes',
    permissionRequired: 'view_records',
    functionBlockRequired: 'clinical_documentation',
    priority: 5
  },
  {
    name: 'Patients',
    path: '/patients',
    icon: Users,
    translationKey: 'patients',
    functionBlockRequired: 'patient_management',
    priority: 6
  },
  {
    name: 'Vital Signs',
    path: '/vital-signs',
    icon: Activity,
    translationKey: 'vitals',
    permissionRequired: 'view_vitals',
    functionBlockRequired: 'vital_signs',
    priority: 7
  },
  {
    name: 'Schedule',
    path: '/schedule',
    icon: Calendar,
    translationKey: 'schedule',
    permissionRequired: 'view_schedule',
    functionBlockRequired: 'appointment_scheduling',
    priority: 8
  },
  {
    name: 'Tasks',
    path: '/tasks',
    icon: ListChecks,
    translationKey: 'tasks',
    priority: 9
  },
  {
    name: 'Clinical Documentation',
    path: '/records',
    icon: FileText,
    translationKey: 'records',
    permissionRequired: 'view_records',
    functionBlockRequired: 'clinical_documentation',
    priority: 10
  },
  {
    name: 'Prescriptions',
    path: '/prescriptions',
    icon: ClipboardList,
    translationKey: 'prescriptions',
    permissionRequired: 'view_prescriptions',
    functionBlockRequired: 'medication_management',
    priority: 11
  },
  {
    name: 'Prescribe Medication',
    path: '/prescribe-medication',
    icon: FileText,
    translationKey: 'prescribeMedication',
    permissionRequired: 'medications:prescribe',
    functionBlockRequired: 'medication_management',
    priority: 12,
    roles: ['doctor', 'admin', 'system_administrator']
  },
  {
    name: 'Messages',
    path: '/messages',
    icon: MessageSquare,
    translationKey: 'messages',
    functionBlockRequired: 'messaging',
    priority: 13
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    translationKey: 'notifications',
    priority: 14
  },
  {
    name: 'Telemedicine',
    path: '/telemedicine',
    icon: Video,
    translationKey: 'telemedicine',
    permissionRequired: 'telemedicine',
    functionBlockRequired: 'telemedicine',
    priority: 15
  },
  {
    name: 'Orders',
    path: '/orders',
    icon: ClipboardList,
    translationKey: 'orders',
    permissionRequired: 'view_orders',
    priority: 16
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart,
    translationKey: 'analytics',
    permissionRequired: 'view_analytics',
    priority: 17,
    roles: ['admin', 'doctor', 'system_administrator']
  },
  {
    name: 'Help & Support',
    path: '/help',
    icon: HelpCircle,
    translationKey: 'help',
    priority: 18
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    translationKey: 'settings',
    priority: 19
  },
  // Admin section
  {
    name: 'Administration',
    path: '/admin',
    icon: Shield,
    translationKey: 'administration',
    permissionRequired: 'manage_users',
    priority: 20,
    roles: ['admin', 'system_administrator'],
    children: [
      {
        name: 'User Approval',
        path: '/admin',
        icon: Users,
        translationKey: 'userApproval',
        permissionRequired: 'manage_users',
        priority: 1
      },
      {
        name: 'Role Management',
        path: '/admin/roles',
        icon: Shield,
        translationKey: 'roleManagement',
        permissionRequired: 'manage_roles',
        priority: 2
      },
      {
        name: 'Function Blocks',
        path: '/admin/function-blocks',
        icon: Package,
        translationKey: 'functionBlocks',
        permissionRequired: 'manage_roles',
        priority: 3
      }
    ]
  }
];

// Helper function to filter sidebar items based on function blocks
export const filterSidebarItemsByFunctionBlocks = (
  items: SidebarItem[],
  hasAccess: (functionBlockId: string) => boolean
): SidebarItem[] => {
  return items
    .filter(item => {
      // If the item doesn't require a function block, show it
      if (!item.functionBlockRequired) return true;
      
      // Otherwise, check if the user has access to the required function block
      return hasAccess(item.functionBlockRequired);
    })
    .map(item => {
      // If the item has children, filter them too
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: item.children.filter(child => {
            if (!child.functionBlockRequired) return true;
            return hasAccess(child.functionBlockRequired);
          })
        };
      }
      return item;
    });
};
