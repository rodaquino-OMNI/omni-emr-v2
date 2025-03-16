
import { RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

export const publicRoutes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> }
];
