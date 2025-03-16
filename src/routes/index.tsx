
import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { protectedRoutes } from './protectedRoutes';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

const router = createBrowserRouter([
  ...authRoutes,
  ...protectedRoutes,
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
