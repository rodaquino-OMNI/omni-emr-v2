
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { appRoutes } from './routes/index';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from './context/LanguageContext';
import { SectorProvider } from './hooks/useSectorContext';
import './App.css';

// Create router using appRoutes
const router = createBrowserRouter(appRoutes);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="omnicare-theme">
      <LanguageProvider>
        <SectorProvider>
          <RouterProvider router={router} />
          <Toaster />
        </SectorProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
