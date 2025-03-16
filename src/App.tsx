
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from './context/LanguageContext';
import { SectorProvider } from './hooks/useSectorContext';
import './App.css';

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
