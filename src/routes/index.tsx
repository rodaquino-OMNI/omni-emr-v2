
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/protected-route';
import { lazy } from 'react';
import { UserRole } from '@/types/auth';

// Import the components
const SectorSelector = lazy(() => import('@/pages/SectorSelector'));
const Patients = lazy(() => import('@/pages/Patients'));
const PatientDetail = lazy(() => import('@/pages/PatientDetail'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Admin = lazy(() => import('@/pages/Admin'));
const MedicationsPage = lazy(() => import('@/pages/Medications'));
const MedicationDetail = lazy(() => import('@/pages/MedicationDetail'));
const RecordsPage = lazy(() => import('@/pages/Records'));
const RecordDetail = lazy(() => import('@/pages/RecordDetail'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const PageNotFound = lazy(() => import('@/pages/PageNotFound'));
const Settings = lazy(() => import('@/pages/Settings'));
const Help = lazy(() => import('@/pages/Help'));
const About = lazy(() => import('@/pages/About'));

export interface AppRoute extends RouteObject {
  title?: string;
  requiredRole?: string[];
  icon?: string;
}

export const routes: AppRoute[] = [
  {
    path: '/login',
    element: <Login />,
    title: 'Login'
  },
  {
    path: '/register',
    element: <Register />,
    title: 'Register'
  },
  {
    path: '/sectors',
    element: <ProtectedRoute><SectorSelector /></ProtectedRoute>,
    title: 'Sector Selection'
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    title: 'Dashboard'
  },
  {
    path: '/patients',
    element: <ProtectedRoute><Patients /></ProtectedRoute>,
    title: 'Patients'
  },
  {
    path: '/patients/:id',
    element: <ProtectedRoute><PatientDetail /></ProtectedRoute>,
    title: 'Patient Detail'
  },
  {
    path: '/medications',
    element: <ProtectedRoute requiredRole={['doctor', 'nurse', 'pharmacist']}><MedicationsPage /></ProtectedRoute>,
    title: 'Medications'
  },
  {
    path: '/medications/:id',
    element: <ProtectedRoute><MedicationDetail /></ProtectedRoute>,
    title: 'Medication Detail'
  },
  {
    path: '/records',
    element: <ProtectedRoute><RecordsPage /></ProtectedRoute>,
    title: 'Records'
  },
  {
    path: '/records/:id',
    element: <ProtectedRoute><RecordDetail /></ProtectedRoute>,
    title: 'Record Detail'
  },
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole={['admin']}><Admin /></ProtectedRoute>,
    title: 'Administration'
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
    title: 'Settings'
  },
  {
    path: '/help',
    element: <ProtectedRoute><Help /></ProtectedRoute>,
    title: 'Help'
  },
  {
    path: '/about',
    element: <ProtectedRoute><About /></ProtectedRoute>,
    title: 'About'
  },
  {
    path: '/',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    title: 'Home'
  },
  {
    path: '*',
    element: <PageNotFound />,
    title: 'Not Found'
  }
];

// Create dynamic routes based on user role and permissions
export const createDynamicRoutes = (
  userRole?: UserRole, 
  userPermissions: string[] = []
): AppRoute[] => {
  // Start with the base routes
  const accessibleRoutes = [...routes];
  
  // Filter out routes that require specific roles if the user doesn't have them
  return accessibleRoutes.filter(route => {
    // If no required role is specified, or user is admin, allow access
    if (!route.requiredRole || userRole === 'admin' || userRole === 'system_administrator') {
      return true;
    }
    
    // Check if user's role is in the required roles for this route
    if (userRole && route.requiredRole.includes(userRole)) {
      return true;
    }
    
    // If user has 'all' permission, allow access
    if (userPermissions.includes('all')) {
      return true;
    }
    
    // If none of the above conditions are met, deny access
    return false;
  });
};

export default routes;
