
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { roleRouteConfig } from '@/registry/RoleBasedRouter';

// Public routes
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';

// Basic layout with authentication
import Layout from '@/components/layout/Layout';
import Dashboard from '@/components/dashboard/Dashboard';
import SectorSelection from '@/pages/SectorSelection';

// Create base routes available to all users
export const appRoutes: RouteObject[] = [
  // Public routes (no authentication required)
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  
  // Protected routes with authentication
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/sectors',
        element: <SectorSelection />
      }
    ]
  },
  
  // 404 route
  {
    path: '*',
    element: <NotFound />
  }
];

// Helper function to create dynamic routes based on user role and permissions
export const createDynamicRoutes = (
  userRole?: string, 
  permissions: string[] = []
): RouteObject[] => {
  if (!userRole) return appRoutes;
  
  // Filter routes based on user role and permissions
  const authorizedRoutes = roleRouteConfig
    .filter(route => {
      // Check if user has required role
      const hasRole = route.roles.includes('all') || route.roles.includes(userRole);
      
      // Check if user has required permission
      const hasPermission = !route.permissions.length || 
        route.permissions.some(perm => permissions.includes(perm));
      
      return hasRole && hasPermission;
    })
    .map(route => ({
      path: route.path,
      element: (
        <ProtectedRoute 
          requiredPermission={route.permissions[0]} 
          requiredRole={userRole}
        >
          <Layout>
            <route.component />
          </Layout>
        </ProtectedRoute>
      )
    }));
  
  return [...appRoutes, ...authorizedRoutes];
};
