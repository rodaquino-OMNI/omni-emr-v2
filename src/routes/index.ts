
import { RouteObject } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { publicRoutes } from './publicRoutes';
import { protectedRoutes } from './protectedRoutes';
import { translationRoutes } from './translationRoutes';

// Combine all routes
export const appRoutes: RouteObject[] = [
  ...authRoutes,
  ...protectedRoutes,
  ...translationRoutes,
  ...publicRoutes // Keep not found route last
];
