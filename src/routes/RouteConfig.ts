
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
      path: '/visit-notes',
      component: 'VisitNotes',
      requiredPermission: 'view_records',
      requireSector: true,
      title: 'Visit Notes',
      description: 'Record clinical visit notes',
      icon: 'ClipboardCheck',
    },
    {
      path: '/telemedicine',
      component: 'Telemedicine',
      requiredPermission: 'telemedicine',
      requireSector: true,
      title: 'Telemedicine',
      description: 'Conduct virtual consultations',
      icon: 'Video',
    },
    {
      path: '/tasks/:id',
      component: 'TaskDetail',
      requiredPermission: 'tasks:view',
      requireSector: true,
      title: 'Task Detail',
      description: 'View and manage task details',
      icon: 'ListChecks',
    },
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
      path: '/medication-administration',
      component: 'MedicationAdministration',
      requiredPermission: 'administer_medications',
      requireSector: true,
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      requiredPermission: 'view_medications',
      requireSector: true,
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      requiredPermission: 'administer_medications',
      requireSector: true,
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      requiredPermission: 'view_medications',
      requireSector: true,
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      requiredPermission: 'administer_medications',
      requireSector: true,
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      requiredPermission: 'view_medications',
      requireSector: true,
      title: 'Medication Details',
      description: 'View medication details',
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
    // Patient-related routes
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
      path: '/patients/:id',
      component: 'PatientDetail',
      requiredPermission: 'patients:view',
      requireSector: true,
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
      requiredPermission: 'patients:view',
      requireSector: true,
    },
    
    // Task management
    {
      path: '/tasks',
      component: 'Tasks',
      requiredPermission: 'tasks:view',
      requireSector: true,
      title: 'Tasks',
      description: 'Manage tasks',
      icon: 'ListChecks',
    },
    
    // Clinical monitoring
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
      path: '/critical-results',
      component: 'CriticalResults',
      requiredPermission: 'view_critical_results',
      requireSector: true,
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      requiredPermission: 'manage_fluid_balance',
      requireSector: true,
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    
    // Scheduling
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
    
    // Documentation
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
    
    // Medication management
    {
      path: '/medications',
      component: 'Medications',
      requiredPermission: 'medications:administer',
      requireSector: true,
      title: 'Medications',
      description: 'Administer medications',
      icon: 'Pill',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      requiredPermission: 'administer_medications',
      requireSector: true,
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      requiredPermission: 'view_medications',
      requireSector: true,
      title: 'Medication Details',
      description: 'View medication details',
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
    },
    {
      path: '/admin/roles',
      component: 'Admin/RoleManagement',
      requiredPermission: 'manage_roles',
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      icon: 'Shield',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    }, {
      path: '/admin/roles',
      component: 'Admin/RoleManagement',
      requiredPermission: 'manage_roles',
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      icon: 'Shield',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    }, {
      path: '/admin/roles',
      component: 'Admin/RoleManagement',
      requiredPermission: 'manage_roles',
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      icon: 'Shield',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    }, {
      path: '/critical-results',
      component: 'CriticalResults',
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
    }, {
      path: '/critical-results',
      component: 'CriticalResults',
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
    },
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
    },
    {
      path: '/admin/roles',
      component: 'Admin/RoleManagement',
      requiredPermission: 'manage_roles',
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      icon: 'Shield',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    }, {
      path: '/admin/roles',
      component: 'Admin/RoleManagement',
      requiredPermission: 'manage_roles',
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      icon: 'Shield',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    }, {
      path: '/admin/roles',
      component: 'Admin/RoleManagement',
      requiredPermission: 'manage_roles',
      title: 'Role Management',
      description: 'Manage user roles and permissions',
      icon: 'Shield',
    },
    {
      path: '/medication-administration',
      component: 'MedicationAdministration',
      title: 'Medication Administration',
      description: 'Administer medications to patients',
      icon: 'Pill',
    },
    {
      path: '/medications/:id',
      component: 'MedicationView',
      title: 'Medication Details',
      description: 'View medication details',
      icon: 'Pill',
    }, {
      path: '/critical-results',
      component: 'CriticalResults',
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
    }, {
      path: '/critical-results',
      component: 'CriticalResults',
      title: 'Critical Results',
      description: 'View and manage critical test results',
      icon: 'AlertTriangle',
    },
    {
      path: '/fluid-balance',
      component: 'FluidBalance',
      title: 'Fluid Balance',
      description: 'Track patient fluid intake and output',
      icon: 'Droplet',
    },
    {
      path: '/patients/:id/profile',
      component: 'PatientProfile',
    },
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
