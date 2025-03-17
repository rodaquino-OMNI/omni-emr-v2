
import React, { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes, createDynamicRoutes } from './routes/index';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from './context/LanguageContext';
import { SectorProvider } from './hooks/useSectorContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { PatientsProvider } from './hooks/usePatientsContext';
import { useAuth } from './context/AuthContext';
import { usePermissions } from './hooks/usePermissions';
import './App.css';

// Import registry configuration
import './registry/PatientViewRegistration';

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
  
  // Get all user permissions
  const userPermissions = useMemo(() => {
    if (!user) return [];
    
    if (user?.permissions) {
      return user.permissions;
    }
    
    // If no explicit permissions, derive from role (this is a fallback)
    if (user?.role) {
      if (user.role === 'admin' || user.role === 'system_administrator') {
        return ['all'];
      }
      
      // Return basic permissions based on role
      return ['dashboard:view'];
    }
    
    return [];
  }, [user]);
  
  // Create dynamic routes based on user role and permissions
  const router = useMemo(() => {
    try {
      const routesToUse = user?.role 
        ? createDynamicRoutes(user.role, userPermissions) 
        : routes;
      
      return createBrowserRouter(routesToUse);
    } catch (error) {
      console.error('Error creating router:', error);
      // Fallback to basic routes
      return createBrowserRouter(routes);
    }
  }, [user, userPermissions]);
  
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
