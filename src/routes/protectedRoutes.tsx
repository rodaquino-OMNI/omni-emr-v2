
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
              requiredRoles={['doctor', 'nurse', 'administrative']}
              requiredPermission="patients:view"
            >
              {React.lazy(() => import('../pages/Patients'))}
            </RoleBasedRoute>
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
              requiredRoles={['doctor', 'nurse', 'administrative']}
              requiredPermission="patients:view"
            >
              {React.lazy(() => import('../pages/PatientDetail'))}
            </RoleBasedRoute>
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
              requiredRoles={['doctor', 'nurse', 'specialist']}
              requiredPermission="notes:view"
            >
              {React.lazy(() => import('../pages/ClinicalDocumentation'))}
            </RoleBasedRoute>
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
              requiredRoles={['doctor', 'nurse', 'pharmacist']}
              requiredPermission="medications:view"
            >
              {React.lazy(() => import('../pages/Medications'))}
            </RoleBasedRoute>
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
