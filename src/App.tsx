
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
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="omnicare-theme">
        <AuthProvider>
          <SectorProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={<Index />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  {/* Sector selection is the entry point after authentication */}
                  <Route path="/sectors" element={<SectorSelection />} />
                  
                  {/* Role-independent routes */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Role-specific routes with nested access control */}
                  <Route path="/patients/:id" element={
                    <PatientDetail />
                  } />
                  
                  {/* Doctor-specific routes */}
                  <Route path="/medications" element={
                    <ProtectedRoute requiredPermission="view_medications">
                      <Medications />
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect authenticated users to sector selection if they try to access the root */}
                  <Route path="/" element={<Navigate to="/sectors" replace />} />
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
