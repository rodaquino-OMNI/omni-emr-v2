
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import SectorSelection from '../pages/SectorSelection';

export const protectedRoutes: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/sectors',
        element: <SectorSelection />
      }
    ]
  }
];
