
import { RouteObject } from 'react-router-dom';
import Index from '../pages/Index';
import NotFound from '../pages/NotFound';

export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Index /> },
  { path: "*", element: <NotFound /> }
];
