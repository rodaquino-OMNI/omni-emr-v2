
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Patients from '@/pages/Patients';
import Dashboard from '@/pages/Dashboard';
import MedicationsPage from '@/pages/Medications';
import Admin from '@/pages/Admin';
import Settings from '@/pages/Settings';
import PatientDetail from '@/pages/PatientDetail';
import PatientProfile from '@/pages/PatientProfile';
import ClinicalDocumentation from '@/pages/ClinicalDocumentation';
import Prescriptions from '@/pages/Prescriptions';
import Records from '@/pages/Records';
import PrescribeMedication from '@/pages/PrescribeMedication';
import RxNormManagement from '@/pages/RxNormManagement';
import { UserRole } from '@/types/auth';

// Define route types
export interface AppRoute {
  path: string;
  element: React.ReactNode;
  title?: string;
  children?: AppRoute[];
  index?: boolean;
  errorElement?: React.ReactNode;
}

// Define base routes
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/patients',
    element: <ProtectedRoute><Patients /></ProtectedRoute>,
  },
  {
    path: '/patients/:id',
    element: <ProtectedRoute><PatientDetail /></ProtectedRoute>,
  },
  {
    path: '/patient-profile/:id',
    element: <ProtectedRoute><PatientProfile /></ProtectedRoute>,
  },
  {
    path: '/medications',
    element: <ProtectedRoute><MedicationsPage /></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <ProtectedRoute requiredRoles={['admin', 'system_administrator']}><Admin /></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><Settings /></ProtectedRoute>,
  },
  {
    path: '/documentation',
    element: <ProtectedRoute><ClinicalDocumentation /></ProtectedRoute>,
  },
  {
    path: '/prescriptions',
    element: <ProtectedRoute><Prescriptions /></ProtectedRoute>,
  },
  {
    path: '/records',
    element: <ProtectedRoute><Records /></ProtectedRoute>,
  },
  {
    path: '/prescribe/:patientId',
    element: <ProtectedRoute requiredRoles={['doctor', 'physician', 'specialist']}><PrescribeMedication /></ProtectedRoute>,
  },
  {
    path: '/rxnorm',
    element: <ProtectedRoute><RxNormManagement /></ProtectedRoute>,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
];

// Create dynamic routes based on user role and permissions
export const createDynamicRoutes = (role?: UserRole, permissions?: string[]): RouteObject[] => {
  let dynamicRoutes = [...routes];

  // Add role-specific routes
  if (role === 'admin' || role === 'system_administrator') {
    // Add admin-specific routes
    dynamicRoutes.push({
      path: '/admin-tools',
      element: <ProtectedRoute><Admin /></ProtectedRoute>,
    });
  }

  if (role === 'doctor' || role === 'physician' || role === 'specialist') {
    // Add doctor-specific routes
    dynamicRoutes.push({
      path: '/my-patients',
      element: <ProtectedRoute><Patients /></ProtectedRoute>,
    });
  }

  if (role === 'pharmacist') {
    // Add pharmacist-specific routes
    dynamicRoutes.push({
      path: '/pharmacy',
      element: <ProtectedRoute><Navigate to="/medications" replace /></ProtectedRoute>,
    });
  }

  // Add routes based on permissions
  if (permissions?.includes('prescriptions:write') || 
      role === 'doctor' || 
      role === 'physician' || 
      role === 'specialist') {
    dynamicRoutes.push({
      path: '/prescribe',
      element: <ProtectedRoute><Navigate to="/prescriptions" replace /></ProtectedRoute>,
    });
  }

  return dynamicRoutes;
};

export default routes;
