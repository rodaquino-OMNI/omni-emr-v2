
import { RouteObject } from 'react-router-dom';
import Login from '../pages/Login';
import RegisterPage from '../pages/Register';
import AuthCallback from '../pages/AuthCallback';

export const authRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/auth/callback", element: <AuthCallback /> }
];
