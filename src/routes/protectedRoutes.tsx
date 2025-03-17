
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import SectorSelection from '../pages/SectorSelection';
import Unauthorized from '../pages/Unauthorized';
import { RoleBasedRoute } from '@/registry/RoleBasedRouter';

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute requiredPermission="dashboard:view">
            <Dashboard />
          </ProtectedRoute>
        ),
        handle: {
          requiredPermission: "dashboard:view"
        }
      },
      {
        path: '/sectors',
        element: <ProtectedRoute><SectorSelection /></ProtectedRoute>
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />
      },
      {
        path: '/patients',
        element: (
          <ProtectedRoute 
            requiredPermission="patients:view"
            requiredRole={['doctor', 'nurse', 'administrative']}
          >
            <RoleBasedRoute
              element={<React.Suspense fallback={<div>Loading...</div>}>
                {React.createElement(React.lazy(() => import('../pages/Patients')))}
              </React.Suspense>}
              requiredRoles={['doctor', 'nurse', 'administrative']}
              requiredPermission="patients:view"
            />
          </ProtectedRoute>
        ),
        handle: {
          requiredPermission: "patients:view",
          requiredRoles: ['doctor', 'nurse', 'administrative']
        }
      },
      {
        path: '/patients/:id',
        element: (
          <ProtectedRoute 
            requiredPermission="patients:view"
            requiredRole={['doctor', 'nurse', 'administrative']}
          >
            <RoleBasedRoute
              element={<React.Suspense fallback={<div>Loading...</div>}>
                {React.createElement(React.lazy(() => import('../pages/PatientDetail')))}
              </React.Suspense>}
              requiredRoles={['doctor', 'nurse', 'administrative']}
              requiredPermission="patients:view"
            />
          </ProtectedRoute>
        ),
        handle: {
          requiredPermission: "patients:view",
          requiredRoles: ['doctor', 'nurse', 'administrative']
        }
      },
      {
        path: '/clinical-documentation',
        element: (
          <ProtectedRoute requiredPermission="notes:view">
            <RoleBasedRoute
              element={<React.Suspense fallback={<div>Loading...</div>}>
                {React.createElement(React.lazy(() => import('../pages/ClinicalDocumentation')))}
              </React.Suspense>}
              requiredRoles={['doctor', 'nurse', 'specialist']}
              requiredPermission="notes:view"
            />
          </ProtectedRoute>
        ),
        handle: {
          requiredPermission: "notes:view",
          requiredRoles: ['doctor', 'nurse', 'specialist']
        }
      },
      {
        path: '/medications',
        element: (
          <ProtectedRoute requiredPermission="medications:view">
            <RoleBasedRoute
              element={<React.Suspense fallback={<div>Loading...</div>}>
                {React.createElement(React.lazy(() => import('../pages/Medications')))}
              </React.Suspense>}
              requiredRoles={['doctor', 'nurse', 'pharmacist']}
              requiredPermission="medications:view"
            />
          </ProtectedRoute>
        ),
        handle: {
          requiredPermission: "medications:view",
          requiredRoles: ['doctor', 'nurse', 'pharmacist']
        }
      }
      // Additional protected routes can be added here
    ]
  }
];
