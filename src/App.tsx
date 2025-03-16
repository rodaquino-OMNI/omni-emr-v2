import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { SectorProvider } from './hooks/useSectorContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Medications from './pages/Medications';
import Settings from './pages/Settings';
import RegisterPage from './pages/Register';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import SectorSelection from './pages/SectorSelection';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="omnicare-theme">
        <AuthProvider>
          <SectorProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<Index />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/sectors" element={<SectorSelection />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/patients/:id" element={<PatientDetail />} />
                  <Route path="/medications" element={<Medications />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* Add more protected routes here */}
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster position="top-right" richColors closeButton />
          </SectorProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
