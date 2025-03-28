import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, RouterProvider, RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@/context/AuthContext';
import { checkSupabaseConnection } from '@/utils/supabaseConnectivity'; // Fixed function name
import { RouteDefinition, getRoutesByRole, filterRoutesByPermissions } from './RouteConfig';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleBasedRoutes from './RoleBasedRoutes';

// Generic function to lazy load a component
const TaskDetail = lazy(() => import('../pages/TaskDetail'));
const Telemedicine = lazy(() => import('../pages/Telemedicine'));
const VisitNotes = lazy(() => import('../pages/VisitNotes'));
// Simplify the lazyLoad function to avoid syntax errors
const lazyLoad = (componentPath: string) => {
  // Handle paths with or without extensions
  const fullComponentPath = componentPath.endsWith('.js') || componentPath.endsWith('.tsx')
    ? `../pages/${componentPath}`
    : `../pages/${componentPath}.tsx`;

  // Use simple import pattern without .then() chain
  return lazy(() => import(/* @vite-ignore */ fullComponentPath));
};

// Define lazy-loaded components
const Login = lazy(() => import('../pages/Login').then(module => ({ default: module.default })));
const AuthCallback = lazy(() => import('../pages/AuthCallback').then(module => ({ default: module.default })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.default })));
const Patients = lazy(() => import('../pages/Patients').then(module => ({ default: module.default })));
const PatientDetail = lazy(() => import('../pages/PatientDetail').then(module => ({ default: module.default })));
const PatientProfile = lazy(() => import('../pages/PatientProfile').then(module => ({ default: module.default })));
// Add explicit file extension to fix TypeScript module resolution
const Records = lazy(() => import('../pages/Records.tsx').then(module => ({ default: module.default })));
const ClinicalDocumentation = lazy(() => import('../pages/ClinicalDocumentation').then(module => ({ default: module.default })));
const Orders = lazy(() => import('../pages/Orders').then(module => ({ default: module.default })));
const Medications = lazy(() => import('../pages/Medications').then(module => ({ default: module.default })));
const Appointments = lazy(() => import('../pages/Appointments').then(module => ({ default: module.default })));
const EmergencyTriageWorkflow = lazy(() => import('../components/emergency/EmergencyTriageWorkflow').then(module => ({ default: module.default })));
const Settings = lazy(() => import('../pages/Settings').then(module => ({ default: module.default })));
const Unauthorized = lazy(() => import('../pages/Unauthorized').then(module => ({ default: module.default })));
const PageNotFound = lazy(() => import('../pages/PageNotFound').then(module => ({ default: module.default })));
const PrescribeMedication = lazy(() => import('../pages/PrescribeMedication').then(module => ({ default: module.default })));
const Prescriptions = lazy(() => import('../pages/Prescriptions').then(module => ({ default: module.default })));
const PrescriptionView = lazy(() => import('../pages/PrescriptionView').then(module => ({ default: module.default })));
const RoleManagement = lazy(() => import('../pages/Admin/RoleManagement').then(module => ({ default: module.default })));
const MedicationView = lazy(() => import('../pages/MedicationView').then(module => ({ default: module.default })));
const MedicationAdministration = lazy(() => import('../pages/MedicationAdministration').then(module => ({ default: module.default })));
// Add missing lazy-loaded components
const Tasks = lazy(() => import('../pages/Tasks').then(module => ({ default: module.default })));
const VitalSigns = lazy(() => import('../pages/VitalSigns').then(module => ({ default: module.default })));
const Schedule = lazy(() => import('../pages/Schedule').then(module => ({ default: module.default })));
const CriticalResults = lazy(() => import('../pages/CriticalResults').then(module => ({ default: module.default })));
const FluidBalance = lazy(() => import('../pages/FluidBalance').then(module => ({ default: module.default })));

// Function to create protected route from a route definition
const createProtectedRoute = (routeDef: RouteDefinition): React.ReactNode => {
  const Component = lazyLoad(routeDef.component);
  
  return (
    <Route
      path={routeDef.path}
      key={routeDef.path}
      element={
        <ProtectedRoute
          requiredPermission={routeDef.requiredPermission}
          requiredRole={routeDef.requiredRoles}
          requireSector={routeDef.requireSector}
        >
          <RoleBasedRoutes
            requiredRoles={routeDef.requiredRoles}
            requiredPermission={routeDef.requiredPermission}
            fallbackPath="/unauthorized"
          >
            <Suspense fallback={<Loading />}>
              <Component />
            </Suspense>
          </RoleBasedRoutes>
        </ProtectedRoute>
      }
    />
  );
};

// Create dynamic routes based on user role and permissions
export const createDynamicRoutes = (userRole: string, userPermissions: string[] = []): RouteObject[] => {
  // Get routes for this role
  const roleRoutes = getRoutesByRole(userRole as any);
  
  // Filter routes based on user permissions
  const accessibleRoutes = filterRoutesByPermissions(roleRoutes, userPermissions);
  
  // Create the routes configuration
  return [
    {
      path: '/login',
      element: <Suspense fallback={<Loading />}><Login /></Suspense>,
    },
    {
      path: '/auth/callback',
      element: <Suspense fallback={<Loading />}><AuthCallback /></Suspense>,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: accessibleRoutes.map(route => ({
        path: route.path.startsWith('/') ? route.path.substring(1) : route.path,
        element: (
          <ProtectedRoute
            requiredPermission={route.requiredPermission}
            requiredRole={route.requiredRoles}
            requireSector={route.requireSector}
          >
            <Suspense fallback={<Loading />}>
              {React.createElement(lazyLoad(route.component))}
            </Suspense>
          </ProtectedRoute>
        ),
        index: route.isIndex || false,
      })),
    },
    {
      path: '*',
      element: <Suspense fallback={<Loading />}><PageNotFound /></Suspense>,
    },
  ];
};

// Fallback static routes when user role/permissions are not available
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Suspense fallback={<Loading />}><Login /></Suspense>,
  },
  {
    path: '/auth/callback',
    element: <Suspense fallback={<Loading />}><AuthCallback /></Suspense>,
  },
  {
    path: '/unauthorized',
    element: <Suspense fallback={<Loading />}><Unauthorized /></Suspense>,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Suspense fallback={<Loading />}><Dashboard /></Suspense>,
      },
      {
        path: 'patients',
        element: <Suspense fallback={<Loading />}><Patients /></Suspense>,
      },
      {
        path: 'patients/:id',
        element: <Suspense fallback={<Loading />}><PatientDetail /></Suspense>,
      },
      {
        path: 'patient-profile/:id',
        element: <Suspense fallback={<Loading />}><PatientProfile /></Suspense>,
      },
      {
        path: 'records',
        element: <Suspense fallback={<Loading />}><Records /></Suspense>,
      },
      {
        path: 'clinical-documentation',
        element: <Suspense fallback={<Loading />}><ClinicalDocumentation /></Suspense>,
      },
      {
        path: 'clinical-documentation/:id/:patientId',
        element: <Suspense fallback={<Loading />}><ClinicalDocumentation /></Suspense>,
      },
      {
        path: 'orders',
        element: <Suspense fallback={<Loading />}><Orders /></Suspense>,
      },
      {
        path: 'medications',
        element: <Suspense fallback={<Loading />}><Medications /></Suspense>,
      },
      {
        path: 'appointments',
        element: <Suspense fallback={<Loading />}><Appointments /></Suspense>,
      },
      {
        path: 'emergency/:patientId',
        element: (
          <Suspense fallback={<Loading />}>
            {/* Render with required props that will be filled from URL params */}
            <EmergencyTriageWorkflow
              patientId=""
              patientName=""
            />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: <Suspense fallback={<Loading />}><Settings /></Suspense>,
      },
      {
        path: 'medications',
        element: <Suspense fallback={<Loading />}><Medications /></Suspense>,
      },
      {
        path: 'prescribe-medication',
        element: <Suspense fallback={<Loading />}><PrescribeMedication /></Suspense>,
      },
      {
        path: 'prescriptions',
        element: <Suspense fallback={<Loading />}><Prescriptions /></Suspense>,
      },
      {
        path: 'prescriptions/:id',
        element: <Suspense fallback={<Loading />}><PrescriptionView /></Suspense>,
      },
      {
        path: 'tasks',
        element: <Suspense fallback={<Loading />}><Tasks /></Suspense>,
      },
      {
        path: 'vital-signs',
        element: <Suspense fallback={<Loading />}><VitalSigns /></Suspense>,
      },
      {
        path: 'schedule',
        element: <Suspense fallback={<Loading />}><Schedule /></Suspense>,
      },
      {
        path: 'tasks',
        element: <Suspense fallback={<Loading />}><Tasks /></Suspense>,
      },
      {
        path: 'vital-signs',
        element: <Suspense fallback={<Loading />}><VitalSigns /></Suspense>,
      },
      {
        path: 'schedule',
        element: <Suspense fallback={<Loading />}><Schedule /></Suspense>,
      },
      {
        path: 'critical-results',
        element: <Suspense fallback={<Loading />}><CriticalResults /></Suspense>,
      },
      {
        path: 'fluid-balance',
        element: <Suspense fallback={<Loading />}><FluidBalance /></Suspense>,
      },
    
      {
        path: 'admin/roles',
        element: <Suspense fallback={<Loading />}><RoleManagement /></Suspense>,
      },
      {
        path: 'medications/:id',
        element: <Suspense fallback={<Loading />}><MedicationView /></Suspense>,
      },
      {
        path: 'medication-administration',
        element: <Suspense fallback={<Loading />}><MedicationAdministration /></Suspense>,
      },],
  },
  {
    path: '*',
    element: <Suspense fallback={<Loading />}><PageNotFound /></Suspense>,
  },
];

export default function AppRouter() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}
