import { LucideIcon, Home, Users, FileText, Pill, Calendar, MessageSquare, Video, HelpCircle, ClipboardList, Bell, ListChecks, Activity, Droplet, Settings, BarChart, Stethoscope, BookUser, FileHeart, FlaskConical, ClipboardCheck, Siren, Shield, Package, AlertTriangle } from 'lucide-react';

export type SidebarItem = {
  name: string;
  path: string;
  icon: LucideIcon;
  translationKey: string;
  permissionRequired?: string;
  functionBlockRequired?: string;
  priority: number;
  roles?: string[];
  tooltip?: string; // Added tooltip property for additional context
  category?: string; // Added category for grouping related items
  children?: Omit<SidebarItem, 'children'>[];
};

// Define categories for better organization
export const CATEGORIES = {
  CLINICAL: 'clinical',
  ADMINISTRATIVE: 'administrative',
  COMMUNICATION: 'communication',
  SYSTEM: 'system'
};

export const sidebarItems: SidebarItem[] = [
  // Dashboard - Always first for all users
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Home,
    translationKey: 'dashboard',
    priority: 1,
    tooltip: 'View your personalized dashboard with key information',
    category: CATEGORIES.SYSTEM
  },

  // EMERGENCY & CRITICAL CARE SECTION - Highest priority for clinical staff
  {
    name: 'Emergency Care',
    path: '/emergency-care',
    icon: Siren,
    translationKey: 'emergencyCare',
    permissionRequired: 'view_emergency',
    functionBlockRequired: 'emergency_care',
    priority: 2,
    roles: ['doctor', 'nurse', 'administrative'],
    tooltip: 'Access emergency care workflows and triage',
    category: CATEGORIES.CLINICAL
  },
  {
    name: 'Critical Results',
    path: '/critical-results',
    icon: AlertTriangle,
    translationKey: 'criticalResults',
    permissionRequired: 'view_critical_results',
    functionBlockRequired: 'clinical_alerts',
    priority: 3,
    roles: ['doctor', 'nurse', 'admin', 'system_administrator'],
    tooltip: 'View critical test results requiring immediate attention',
    category: CATEGORIES.CLINICAL
  },

  // PATIENT CARE SECTION - Core clinical workflows
  {
    name: 'Patients',
    path: '/patients',
    icon: Users,
    translationKey: 'patients',
    functionBlockRequired: 'patient_management',
    priority: 4,
    tooltip: 'View and manage patient information',
    category: CATEGORIES.CLINICAL
  },
  {
    name: 'Vital Signs',
    path: '/vital-signs',
    icon: Activity,
    translationKey: 'vitals',
    permissionRequired: 'view_vitals',
    functionBlockRequired: 'vital_signs',
    priority: 5,
    tooltip: 'Record and monitor patient vital signs',
    category: CATEGORIES.CLINICAL
  },
  {
    name: 'Visit Notes',
    path: '/visit-notes',
    icon: ClipboardCheck,
    translationKey: 'visitNotes',
    permissionRequired: 'view_records',
    functionBlockRequired: 'clinical_documentation',
    priority: 6,
    tooltip: 'Create and view clinical visit notes',
    category: CATEGORIES.CLINICAL
  },
  {
    name: 'Clinical Documentation',
    path: '/records',
    icon: FileText,
    translationKey: 'records',
    permissionRequired: 'view_records',
    functionBlockRequired: 'clinical_documentation',
    priority: 7,
    tooltip: 'Access comprehensive patient medical records',
    category: CATEGORIES.CLINICAL
  },

  // MEDICATION MANAGEMENT SECTION - Important for doctors and nurses
  {
    name: 'Medication Administration',
    path: '/medication-administration',
    icon: Pill,
    translationKey: 'medicationAdministration',
    permissionRequired: 'administer_medications',
    functionBlockRequired: 'medication_management',
    priority: 8,
    roles: ['nurse', 'doctor'],
    tooltip: 'Administer and record patient medications',
    category: CATEGORIES.CLINICAL
  },
  {
    name: 'Prescriptions',
    path: '/prescriptions',
    icon: ClipboardList,
    translationKey: 'prescriptions',
    permissionRequired: 'view_prescriptions',
    functionBlockRequired: 'medication_management',
    priority: 9,
    tooltip: 'View and manage patient prescriptions',
    category: CATEGORIES.CLINICAL
  },
  {
    name: 'Prescribe Medication',
    path: '/prescribe-medication',
    icon: FileText,
    translationKey: 'prescribeMedication',
    permissionRequired: 'medications:prescribe',
    functionBlockRequired: 'medication_management',
    priority: 10,
    roles: ['doctor', 'admin', 'system_administrator'],
    tooltip: 'Create new medication prescriptions',
    category: CATEGORIES.CLINICAL
  },

  // NURSING SPECIFIC SECTION
  {
    name: 'Fluid Balance',
    path: '/fluid-balance',
    icon: Droplet, 
    translationKey: 'fluidBalance',
    permissionRequired: 'manage_fluid_balance',
    functionBlockRequired: 'fluid_balance',
    priority: 11,
    roles: ['nurse', 'doctor'],
    tooltip: 'Monitor and record patient fluid intake and output',
    category: CATEGORIES.CLINICAL
  },

  // WORKFLOW & SCHEDULING SECTION
  {
    name: 'Tasks',
    path: '/tasks',
    icon: ListChecks,
    translationKey: 'tasks',
    priority: 12,
    tooltip: 'View and manage your assigned tasks',
    category: CATEGORIES.ADMINISTRATIVE
  },
  {
    name: 'Schedule',
    path: '/schedule',
    icon: Calendar,
    translationKey: 'schedule',
    permissionRequired: 'view_schedule',
    functionBlockRequired: 'appointment_scheduling',
    priority: 13,
    tooltip: 'View and manage appointments and schedules',
    category: CATEGORIES.ADMINISTRATIVE
  },
  {
    name: 'Orders',
    path: '/orders',
    icon: ClipboardList,
    translationKey: 'orders',
    permissionRequired: 'view_orders',
    priority: 14,
    tooltip: 'Manage clinical orders for patients',
    category: CATEGORIES.ADMINISTRATIVE
  },

  // COMMUNICATION SECTION
  {
    name: 'Messages',
    path: '/messages',
    icon: MessageSquare,
    translationKey: 'messages',
    functionBlockRequired: 'messaging',
    priority: 15,
    tooltip: 'Send and receive secure messages',
    category: CATEGORIES.COMMUNICATION
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: Bell,
    translationKey: 'notifications',
    priority: 16,
    tooltip: 'View system notifications and alerts',
    category: CATEGORIES.COMMUNICATION
  },
  {
    name: 'Telemedicine',
    path: '/telemedicine',
    icon: Video,
    translationKey: 'telemedicine',
    permissionRequired: 'telemedicine',
    functionBlockRequired: 'telemedicine',
    priority: 17,
    tooltip: 'Conduct virtual patient consultations',
    category: CATEGORIES.COMMUNICATION
  },

  // ANALYTICS & ADMINISTRATION - Lower priority for most clinical users
  {
    name: 'Analytics',
    path: '/analytics',
    icon: BarChart,
    translationKey: 'analytics',
    permissionRequired: 'view_analytics',
    priority: 18,
    roles: ['admin', 'doctor', 'system_administrator'],
    tooltip: 'View clinical and operational analytics',
    category: CATEGORIES.ADMINISTRATIVE
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    translationKey: 'settings',
    priority: 19,
    tooltip: 'Configure application settings and preferences',
    category: CATEGORIES.SYSTEM
  },
  {
    name: 'Help & Support',
    path: '/help',
    icon: HelpCircle,
    translationKey: 'help',
    priority: 20,
    tooltip: 'Access help documentation and support resources',
    category: CATEGORIES.SYSTEM
  },

  // ADMINISTRATION SECTION - Admin users only
  {
    name: 'Administration',
    path: '/admin',
    icon: Shield,
    translationKey: 'administration',
    permissionRequired: 'manage_users',
    priority: 21,
    roles: ['admin', 'system_administrator'],
    tooltip: 'Access administrative functions',
    category: CATEGORIES.ADMINISTRATIVE,
    children: [
      {
        name: 'User Approval',
        path: '/admin',
        icon: Users,
        translationKey: 'userApproval',
        permissionRequired: 'manage_users',
        priority: 1,
        tooltip: 'Review and approve user registration requests'
      },
      {
        name: 'Role Management',
        path: '/admin/roles',
        icon: Shield,
        translationKey: 'roleManagement',
        permissionRequired: 'manage_roles',
        priority: 2,
        tooltip: 'Manage user roles and permissions'
      },
      {
        name: 'Function Blocks',
        path: '/admin/function-blocks',
        icon: Package,
        translationKey: 'functionBlocks',
        permissionRequired: 'manage_roles',
        priority: 3,
        tooltip: 'Configure system function blocks and features'
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

// Helper function to filter and sort sidebar items based on user role
export const getSidebarItemsForRole = (
  items: SidebarItem[],
  role: string,
  hasAccess: (functionBlockId: string) => boolean
): SidebarItem[] => {
  // First filter by function blocks
  const functionBlockFiltered = filterSidebarItemsByFunctionBlocks(items, hasAccess);
  
  // Then filter by role and sort by priority
  return functionBlockFiltered
    .filter(item => {
      // If no roles are specified, show to all roles
      if (!item.roles || item.roles.length === 0) return true;
      
      // Otherwise, check if the user's role is in the allowed roles
      return item.roles.includes(role);
    })
    .sort((a, b) => a.priority - b.priority);
};

// Helper function to group sidebar items by category
export const groupSidebarItemsByCategory = (
  items: SidebarItem[]
): Record<string, SidebarItem[]> => {
  return items.reduce((groups, item) => {
    const category = item.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, SidebarItem[]>);
};
