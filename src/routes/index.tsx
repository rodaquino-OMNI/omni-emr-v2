
import { RouteObject } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { authRoutes } from './authRoutes';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import PatientDetail from '../pages/PatientDetail';
import MedicalHistory from '../pages/MedicalHistory';
import SectorSelection from '../pages/SectorSelection';
import Patients from '../pages/Patients';
import PatientProfile from '../pages/PatientProfile';

// Protected routes
const protectedRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/sectors",
    element: <ProtectedRoute><SectorSelection /></ProtectedRoute>
  },
  {
    path: "/patients",
    element: <ProtectedRoute><Patients /></ProtectedRoute>
  },
  {
    path: "/patients/:id",
    element: <ProtectedRoute><PatientDetail /></ProtectedRoute>
  },
  {
    path: "/patients/:id/profile",
    element: <ProtectedRoute><PatientProfile /></ProtectedRoute>
  },
  {
    path: "/patients/:id/medical-history",
    element: <ProtectedRoute><MedicalHistory /></ProtectedRoute>
  }
];

// All app routes
export const appRoutes: RouteObject[] = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes
];
