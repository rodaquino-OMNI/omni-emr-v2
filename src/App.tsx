
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './routes/index';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from './context/LanguageContext';
import { SectorProvider } from './hooks/useSectorContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { PatientsProvider } from './hooks/usePatientsContext';
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

// Create router using appRoutes
const router = createBrowserRouter(appRoutes);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="omnicare-theme">
        <AuthProvider>
          <LanguageProvider>
            <SectorProvider>
              <PatientsProvider>
                <RouterProvider router={router} />
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
