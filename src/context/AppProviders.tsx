
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Centralized provider component for all global contexts
 * This allows for a clean hierarchy of providers and ensures
 * proper data flow throughout the application
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Create a client for react-query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ErrorBoundaryWrapper>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundaryWrapper>
  );
};

export default AppProviders;
