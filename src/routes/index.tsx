
import { RouteObject } from 'react-router-dom';
import { publicRoutes } from './publicRoutes';
import { authRoutes } from './authRoutes';
import { protectedRoutes } from './protectedRoutes';
import { translationRoutes } from './translationRoutes';

// Combine all routes
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...authRoutes,
  ...protectedRoutes,
  ...translationRoutes
];
