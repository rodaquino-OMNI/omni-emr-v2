
import { RouteObject } from 'react-router-dom';
import SectorSelector from '@/pages/SectorSelector';
import Patients from '@/pages/Patients';
import PatientDetail from '@/pages/PatientDetail';
import ProtectedRoute from '@/components/auth/protected-route';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';
import MedicationsPage from '@/pages/Medications';
import MedicationDetail from '@/pages/MedicationDetail';
import RecordsPage from '@/pages/Records';
import RecordDetail from '@/pages/RecordDetail';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PageNotFound from '@/pages/PageNotFound';
import { lazy } from 'react';

// Lazy-loaded routes
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

export default routes;
