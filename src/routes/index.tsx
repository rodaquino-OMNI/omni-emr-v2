import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate, RouterProvider, RouteObject } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Loading from '@/components/ui/Loading';
import { useAuth } from '@/context/AuthContext';
import { checkSupabaseConnectivity } from '@/utils/supabaseConnectivity';

// Define a type for lazy route modules
type RouteModule = {
  Component: React.ComponentType<any>;
};

// Generic function to lazy load a component
const lazyLoad = (importFn: () => Promise<RouteModule>, componentName: string) => {
  return lazy(() =>
    importFn().then((module) => {
      if (!module.Component) {
        throw new Error(`Component "${componentName}" not found in module.`);
      }
      return { default: module.Component };
    })
  );
};

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Define lazy-loaded components
const Login = lazy(() => import('../pages/Login').then(module => ({ default: module.default })));
const AuthCallback = lazy(() => import('../pages/AuthCallback').then(module => ({ default: module.default })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(module => ({ default: module.default })));
const Patients = lazy(() => import('../pages/Patients').then(module => ({ default: module.default })));
const PatientDetail = lazy(() => import('../pages/PatientDetail').then(module => ({ default: module.default })));
const PatientProfile = lazy(() => import('../pages/PatientProfile').then(module => ({ default: module.default })));
const Records = lazy(() => import('../pages/Records').then(module => ({ default: module.default })));
const ClinicalDocumentation = lazy(() => import('../pages/ClinicalDocumentation').then(module => ({ default: module.default })));
const Orders = lazy(() => import('../pages/Orders').then(module => ({ default: module.default })));
const Medications = lazy(() => import('../pages/Medications').then(module => ({ default: module.default })));
const Appointments = lazy(() => import('../pages/Appointments').then(module => ({ default: module.default })));
const EmergencyTriageWorkflow = lazy(() => import('../components/emergency/EmergencyTriageWorkflow').then(module => ({ default: module.default })));
const Settings = lazy(() => import('../pages/Settings').then(module => ({ default: module.default })));
const PageNotFound = lazy(() => import('../pages/PageNotFound').then(module => ({ default: module.default })));

// Define dashboard routes
const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: React.createElement(lazyLoad(() => import('../registry/entrypoints/DoctorDashboard'), 'DoctorDashboard'))
  },
  {
    path: "nurse",
    element: React.createElement(lazyLoad(() => import('../registry/entrypoints/NurseDashboard'), 'NurseDashboard'))
  },
  {
    path: "admin",
    element: React.createElement(lazyLoad(() => import('../registry/entrypoints/AdminDashboard'), 'AdminDashboard'))
  }
];

// Router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Suspense fallback={<Loading />}><Login /></Suspense>} />
      <Route path="/auth/callback" element={<Suspense fallback={<Loading />}><AuthCallback /></Suspense>} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>} />
        <Route path="/patients" element={<Suspense fallback={<Loading />}><Patients /></Suspense>} />
        <Route path="/patients/:id" element={<Suspense fallback={<Loading />}><PatientDetail /></Suspense>} />
        <Route path="/patient-profile/:id" element={<Suspense fallback={<Loading />}><PatientProfile /></Suspense>} />
        <Route path="/records" element={<Suspense fallback={<Loading />}><Records /></Suspense>} />
        <Route path="/clinical-documentation" element={<Suspense fallback={<Loading />}><ClinicalDocumentation /></Suspense>} />
         <Route path="/clinical-documentation/:id/:patientId" element={<Suspense fallback={<Loading />}><ClinicalDocumentation /></Suspense>} />
        <Route path="/orders" element={<Suspense fallback={<Loading />}><Orders /></Suspense>} />
        <Route path="/medications" element={<Suspense fallback={<Loading />}><Medications /></Suspense>} />
        <Route path="/appointments" element={<Suspense fallback={<Loading />}><Appointments /></Suspense>} />
        <Route path="/emergency/:patientId" element={<Suspense fallback={<Loading />}><EmergencyTriageWorkflow /></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<Loading />}><Settings /></Suspense>} />
      </Route>
      <Route path="*" element={<Suspense fallback={<Loading />}><PageNotFound /></Suspense>} />
    </>
  )
);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
