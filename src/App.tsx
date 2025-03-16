
import React, { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './routes/index';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from './context/LanguageContext';
import { SectorProvider } from './hooks/useSectorContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { PatientsProvider } from './hooks/usePatientsContext';
import { useAuth } from './context/AuthContext';
import { usePermissions } from './hooks/usePermissions';
import { roleRouteConfig } from './registry/RoleBasedRouter';
import './App.css';

// Create a new query client instance for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();
  const { hasPermission } = usePermissions(user);
  
  // Create dynamic routes based on user role and permissions
  const dynamicRoutes = useMemo(() => {
    // Start with base routes from appRoutes
    const routes = [...appRoutes];
    
    // If user is authenticated, add role-specific routes
    if (isAuthenticated && user) {
      const roleSpecificRoutes = roleRouteConfig.filter(route => {
        // Check if user has required role
        const hasRole = route.roles.includes('all') || 
                       (user.role && route.roles.includes(user.role));
        
        // Check if user has required permission
        const hasRequiredPermission = !route.permissions.length || 
                                     route.permissions.some(perm => hasPermission(perm));
        
        return hasRole && hasRequiredPermission;
      });
      
      // Add the filtered routes
      routes.push(...roleSpecificRoutes.map(route => ({
        path: route.path,
        element: <route.component />,
      })));
    }
    
    return routes;
  }, [user, isAuthenticated, hasPermission]);
  
  // Create router using dynamic routes
  const router = createBrowserRouter(dynamicRoutes);
  
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="omnicare-theme">
        <AuthProvider>
          <LanguageProvider>
            <SectorProvider>
              <PatientsProvider>
                <AppRoutes />
                <Toaster />
              </PatientsProvider>
            </SectorProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
