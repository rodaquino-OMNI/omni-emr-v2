
import { UserRole } from '@/types/auth';

export interface RouteDefinition {
  path: string;
  component: string;
  requiredRoles?: UserRole[];
  requiredPermission?: string;
  requireSector?: boolean;
  isFallback?: boolean;
  children?: RouteDefinition[];
  isIndex?: boolean;
  title?: string;
  description?: string;
  icon?: string;
}

// Core routes available to all authenticated users
export const coreRoutes: RouteDefinition[] = [
  {
    path: '/dashboard',
    component: 'Dashboard',
    title: 'Dashboard',
    description: 'Main dashboard',
    icon: 'Home',
  },
  {
    path: '/unauthorized',
    component: 'Unauthorized',
    isFallback: true,
    title: 'Unauthorized',
    description: 'Access denied',
    icon: 'ShieldAlert',
  },
  {
    path: '/settings',
    component: 'Settings',
    title: 'Settings',
    description: 'User settings',
    icon: 'Settings',
  }
];

// Role-specific routes
export const roleSpecificRoutes: Record<UserRole, RouteDefinition[]> = {
  'doctor': [
    {
      path: '/patients',
      component: 'Patients',
      requiredPermission: 'patients:view',
      requireSector: true,
      title: 'Patients',
      description: 'Manage patients',
      icon: 'Users',
    },
    {
      path: '/tasks',
      component: 'Tasks',
      requiredPermission: 'tasks:view',
      requireSector: true,
      title: 'Tasks',
      description: 'Manage tasks',
      icon: 'ListChecks',
    },
    {
      path: '/vital-signs',
      component: 'VitalSigns',
      requiredPermission: 'vitals:view',
      requireSector: true,
      title: 'Vital Signs',
      description: 'Monitor vital signs',
      icon: 'Activity',
    },
    {
      path: '/appointments',
      component: 'Appointments',
      requiredPermission: 'appointments:view',
      requireSector: true,
      title: 'Appointments',
      description: 'Manage appointments',
      icon: 'Calendar',
    },
    {
      path: '/schedule',
      component: 'Schedule',
      requiredPermission: 'schedule:manage',
      requireSector: true,
      title: 'Schedule',
      description: 'Manage schedule',
      icon: 'Clock',
    },
    {
      path: '/patients/:id',
      component: 'PatientDetail',
      requiredPermission: 'patients:view',
      requireSector: true,
    },
    {
      path: '/clinical-documentation',
      component: 'ClinicalDocumentation',
      requiredPermission: 'notes:view',
      requireSector: true,
      title: 'Documentation',
      description: 'Clinical documentation',
      icon: 'FileText',
    },
    {
      path: '/clinical-documentation/:id/:patientId',
      component: 'ClinicalDocumentation',
      requiredPermission: 'notes:view',
      requireSector: true,
    },
    {
      path: '/medications',
      component: 'Medications',
      requiredPermission: 'medications:view',
      requireSector: true,
      title: 'Medications',
      description: 'Manage medications',
      icon: 'Pill',
    },
    {
      path: '/prescribe-medication',
      component: 'PrescribeMedication',
      requiredPermission: 'medications:prescribe',
      requireSector: true,
      title: 'Prescribe',
      description: 'Prescribe medications',
      icon: 'FileEdit',
    },
    {
      path: '/prescriptions',
      component: 'Prescriptions',
      requiredPermission: 'prescriptions:view',
      requireSector: true,
      title: 'Prescriptions',
      description: 'View prescriptions',
      icon: 'ClipboardList',
    },
    {
      path: '/prescriptions/:id',
      component: 'PrescriptionView',
      requiredPermission: 'prescriptions:view',
      requireSector: true,
    },
    {
      path: '/orders',
      component: 'Orders',
      requiredPermission: 'orders:view',
      requireSector: true,
      title: 'Orders',
      description: 'Manage orders',
      icon: 'ClipboardList',
    },
    {
      path: '/emergency/:patientId',
      component: 'EmergencyTriageWorkflow',
      requiredPermission: 'emergency:view',
      requireSector: true,
    }
  ],
  'nurse': [
    {
      path: '/patients',
      component: 'Patients',
      requiredPermission: 'patients:view',
      requireSector: true,
      title: 'Patients',
      description: 'View patients',
      icon: 'Users',
    },
    {
      path: '/tasks',
      component: 'Tasks',
      requiredPermission: 'tasks:view',
      requireSector: true,
      title: 'Tasks',
      description: 'Manage tasks',
      icon: 'ListChecks',
    },
    {
      path: '/vital-signs',
      component: 'VitalSigns',
      requiredPermission: 'vitals:view',
      requireSector: true,
      title: 'Vital Signs',
      description: 'Monitor vital signs',
      icon: 'Activity',
    },
    {
      path: '/appointments',
      component: 'Appointments',
      requiredPermission: 'appointments:view',
      requireSector: true,
      title: 'Appointments',
      description: 'Manage appointments',
      icon: 'Calendar',
    },
    {
      path: '/schedule',
      component: 'Schedule',
      requiredPermission: 'schedule:manage',
      requireSector: true,
      title: 'Schedule',
      description: 'Manage schedule',
      icon: 'Clock',
    },
    {
      path: '/patients/:id',
      component: 'PatientDetail',
      requiredPermission: 'patients:view',
      requireSector: true,
    },
    {
      path: '/clinical-documentation',
      component: 'ClinicalDocumentation',
      requiredPermission: 'notes:view',
      requireSector: true,
      title: 'Documentation',
      description: 'Clinical documentation',
      icon: 'FileText',
    },
    {
      path: '/clinical-documentation/:id/:patientId',
      component: 'ClinicalDocumentation',
      requiredPermission: 'notes:view',
      requireSector: true,
    },
    {
      path: '/medications',
      component: 'Medications',
      requiredPermission: 'medications:administer',
      requireSector: true,
      title: 'Medications',
      description: 'Administer medications',
      icon: 'Pill',
    }
  ],
  'administrative': [
    {
      path: '/patients',
      component: 'Patients',
      requiredPermission: 'patients:view',
      title: 'Patients',
      description: 'View patients',
      icon: 'Users',
    },
    {
      path: '/appointments',
      component: 'Appointments',
      requiredPermission: 'appointments:view',
      title: 'Appointments',
      description: 'Manage appointments',
      icon: 'Calendar',
    }
  ],
  'pharmacist': [
    {
      path: '/medications',
      component: 'Medications',
      requiredPermission: 'medications:view',
      title: 'Medications',
      description: 'Manage medications',
      icon: 'Pill',
    },
    {
      path: '/prescriptions',
      component: 'Prescriptions',
      requiredPermission: 'prescriptions:view',
      title: 'Prescriptions',
      description: 'View prescriptions',
      icon: 'ClipboardList',
    },
    {
      path: '/prescriptions/:id',
      component: 'PrescriptionView',
      requiredPermission: 'prescriptions:view',
    },
    {
      path: '/patients',
      component: 'Patients',
      requiredPermission: 'patients:view',
      title: 'Patients',
      description: 'View patients',
      icon: 'Users',
    }
  ],
  'admin': [
    {
      path: '/patients',
      component: 'Patients',
      title: 'Patients',
      description: 'Manage patients',
      icon: 'Users',
    },
    {
      path: '/tasks',
      component: 'Tasks',
      title: 'Tasks',
      description: 'Manage tasks',
      icon: 'ListChecks',
    },
    {
      path: '/vital-signs',
      component: 'VitalSigns',
      title: 'Vital Signs',
      description: 'Monitor vital signs',
      icon: 'Activity',
    },
    {
      path: '/schedule',
      component: 'Schedule',
      title: 'Schedule',
      description: 'Manage schedule',
      icon: 'Clock',
    },
    {
      path: '/patients/:id',
      component: 'PatientDetail',
    },
    {
      path: '/clinical-documentation',
      component: 'ClinicalDocumentation',
      title: 'Documentation',
      description: 'Clinical documentation',
      icon: 'FileText',
    },
    {
      path: '/medications',
      component: 'Medications',
      title: 'Medications',
      description: 'Manage medications',
      icon: 'Pill',
    },
    {
      path: '/prescribe-medication',
      component: 'PrescribeMedication',
      title: 'Prescribe',
      description: 'Prescribe medications',
      icon: 'FileEdit',
    },
    {
      path: '/prescriptions',
      component: 'Prescriptions',
      title: 'Prescriptions',
      description: 'View prescriptions',
      icon: 'ClipboardList',
    },
    {
      path: '/prescriptions/:id',
      component: 'PrescriptionView',
    },
    {
      path: '/orders',
      component: 'Orders',
      title: 'Orders',
      description: 'Manage orders',
      icon: 'ClipboardList',
    },
    {
      path: '/admin',
      component: 'Admin',
      title: 'Administration',
      description: 'System administration',
      icon: 'Shield',
    }
  ],
  'system_administrator': [
    // Same as admin routes
    {
      path: '/patients',
      component: 'Patients',
      title: 'Patients',
      description: 'Manage patients',
      icon: 'Users',
    },
    {
      path: '/tasks',
      component: 'Tasks',
      title: 'Tasks',
      description: 'Manage tasks',
      icon: 'ListChecks',
    },
    {
      path: '/vital-signs',
      component: 'VitalSigns',
      title: 'Vital Signs',
      description: 'Monitor vital signs',
      icon: 'Activity',
    },
    {
      path: '/schedule',
      component: 'Schedule',
      title: 'Schedule',
      description: 'Manage schedule',
      icon: 'Clock',
    },
    {
      path: '/patients/:id',
      component: 'PatientDetail',
    },
    {
      path: '/clinical-documentation',
      component: 'ClinicalDocumentation',
      title: 'Documentation',
      description: 'Clinical documentation',
      icon: 'FileText',
    },
    {
      path: '/medications',
      component: 'Medications',
      title: 'Medications',
      description: 'Manage medications',
      icon: 'Pill',
    },
    {
      path: '/prescribe-medication',
      component: 'PrescribeMedication',
      title: 'Prescribe',
      description: 'Prescribe medications',
      icon: 'FileEdit',
    },
    {
      path: '/prescriptions',
      component: 'Prescriptions',
      title: 'Prescriptions',
      description: 'View prescriptions',
      icon: 'ClipboardList',
    },
    {
      path: '/prescriptions/:id',
      component: 'PrescriptionView',
    },
    {
      path: '/orders',
      component: 'Orders',
      title: 'Orders',
      description: 'Manage orders',
      icon: 'ClipboardList',
    },
    {
      path: '/admin',
      component: 'Admin',
      title: 'Administration',
      description: 'System administration',
      icon: 'Shield',
    }
  ],
  // Add other roles with empty arrays as placeholders
  'physician': [],
  'lab_technician': [],
  'radiologist': [],
  'therapist': [],
  'patient': [],
  'receptionist': [],
  'medical_assistant': [],
  'insurance_staff': [],
  'researcher': [],
  'coordinator': [],
  'student': [],
  'guest': [],
  'specialist': [],
  'caregiver': [],
  'radiology_technician': [],
  'medical_staff': [],
  'all': []
};

/**
 * Get routes specific to a user's role
 */
export const getRoutesByRole = (role: UserRole): RouteDefinition[] => {
  return [...coreRoutes, ...(roleSpecificRoutes[role] || [])];
};

/**
 * Get all routes for a specific permission
 */
export const getRoutesByPermission = (permission: string): RouteDefinition[] => {
  // Combine all role-specific routes
  const allRoutes = Object.values(roleSpecificRoutes).flat();
  
  // Filter for routes with the specified permission
  return allRoutes.filter(route => route.requiredPermission === permission);
};

/**
 * Filter routes based on user permissions
 */
export const filterRoutesByPermissions = (routes: RouteDefinition[], userPermissions: string[]): RouteDefinition[] => {
  return routes.filter(route => {
    // If no permission required or it's a fallback route, include it
    if (!route.requiredPermission || route.isFallback) {
      return true;
    }
    
    // Otherwise, check if user has the required permission
    return userPermissions.includes(route.requiredPermission) || userPermissions.includes('all');
  });
};
