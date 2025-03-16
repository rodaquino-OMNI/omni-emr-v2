
import { RouteObject, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import SectorSelection from '../pages/SectorSelection';
import Dashboard from '../pages/Dashboard';
import Patients from '../pages/Patients';
import Settings from '../pages/Settings';
import PatientDetail from '../pages/PatientDetail';
import Medications from '../pages/Medications';
import Unauthorized from '../pages/Unauthorized';

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      // Sector selection is the entry point after authentication
      { path: "/sectors", element: <SectorSelection /> },
      
      // Role-independent routes
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/patients", element: <Patients /> },
      { path: "/settings", element: <Settings /> },
      { path: "/unauthorized", element: <Unauthorized /> },
      
      // Role-specific routes with nested access control
      { path: "/patients/:id", element: <PatientDetail /> },
      
      // Doctor-specific routes
      { 
        path: "/medications", 
        element: (
          <ProtectedRoute requiredPermission="view_medications">
            <Medications />
          </ProtectedRoute>
        )
      },
      
      // Redirect authenticated users to sector selection from root
      { path: "/", element: <Navigate to="/sectors" replace /> }
    ]
  }
];
