
import React from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/protected-route';
import Dashboard from '@/pages/Dashboard';
import MedicationList from '@/pages/Medications';
import PatientList from '@/pages/Patients';
import PatientDetail from '@/pages/PatientDetail';
import PatientProfile from '@/pages/PatientProfile';
import Login from '@/pages/Login';
import Prescriptions from '@/pages/Prescriptions';
import ClinicalDocumentation from '@/pages/ClinicalDocumentation';
import Records from '@/pages/Records';
import Admin from '@/pages/Admin';
import Layout from '@/components/layout/Layout';
import { UserRole } from '@/types/auth';

// Create a dummy placeholder for pages that don't exist yet
const PlaceholderPage = () => (
  <div className="flex items-center justify-center h-screen">
    <h1 className="text-2xl">This page is under construction</h1>
  </div>
);

// Define routes
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/patients',
        element: <PatientList />,
      },
      {
        path: '/patients/:id',
        element: <PatientDetail />,
      },
      {
        path: '/patient-profile/:id',
        element: <PatientProfile />,
      },
      {
        path: '/medications',
        element: <MedicationList />,
      },
      {
        path: '/medications/:id',
        element: <PlaceholderPage />,
      },
      {
        path: '/prescriptions',
        element: <Prescriptions />,
      },
      {
        path: '/prescriptions/:id',
        element: <PlaceholderPage />,
      },
      {
        path: '/clinical-documentation',
        element: <ClinicalDocumentation />,
      },
      {
        path: '/records',
        element: <Records />,
      },
      {
        path: '/records/:id',
        element: <PlaceholderPage />,
      },
      {
        path: '/admin',
        element: <Admin />,
      },
      {
        path: '/about',
        element: <PlaceholderPage />,
      },
      {
        path: '*',
        element: <PlaceholderPage />,
      }
    ]
  }
];

// Function to create dynamic routes based on user role and permissions
export const createDynamicRoutes = (userRole?: UserRole, userPermissions: string[] = []): RouteObject[] => {
  // Clone the basic routes
  const dynamicRoutes = [...routes];
  
  // Add role-specific routes
  if (userRole === 'admin' || userRole === 'system_administrator') {
    // Admin gets access to everything
    return dynamicRoutes;
  }
  
  // For non-admin roles, we could filter routes based on permissions
  // This is a simplified implementation
  const permittedRoutes = dynamicRoutes.map(route => {
    if (route.children) {
      const filteredChildren = route.children.filter(childRoute => {
        // Implement permission-based filtering logic here
        // For example, if a route requires a specific permission
        
        // For now, we'll just return all routes for authenticated users
        return true;
      });
      
      return { ...route, children: filteredChildren };
    }
    return route;
  });
  
  return permittedRoutes;
};
