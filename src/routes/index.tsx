
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

// Function to create dynamic routes based on user role and permissions
export const createDynamicRoutes = (role: string, permissions: string[]): RouteObject[] => {
  // Start with public and auth routes that everyone should have access to
  const dynamicRoutes = [...publicRoutes, ...authRoutes];
  
  // Add protected routes - in a real application, you would filter these
  // based on the user's role and permissions
  dynamicRoutes.push(...protectedRoutes);
  
  // Add translation routes for all users
  dynamicRoutes.push(...translationRoutes);
  
  return dynamicRoutes;
};
