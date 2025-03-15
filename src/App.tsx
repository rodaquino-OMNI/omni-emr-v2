
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/sonner';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const PatientProfile = lazy(() => import('./pages/PatientProfile'));
const VitalSigns = lazy(() => import('./pages/VitalSigns'));
const MedicalHistory = lazy(() => import('./pages/MedicalHistory'));
const Prescriptions = lazy(() => import('./pages/Prescriptions'));
const PrescribeMedication = lazy(() => import('./pages/PrescribeMedication'));
const PrescriptionView = lazy(() => import('./pages/PrescriptionView'));
const Medications = lazy(() => import('./pages/Medications'));
const MedicationView = lazy(() => import('./pages/MedicationView'));
const MedicationAdministration = lazy(() => import('./pages/MedicationAdministration'));
const RxNormManagement = lazy(() => import('./pages/RxNormManagement'));
const Records = lazy(() => import('./pages/Records'));
const RecordView = lazy(() => import('./pages/RecordView'));
const ClinicalDocumentation = lazy(() => import('./pages/ClinicalDocumentation'));
const VisitNotes = lazy(() => import('./pages/VisitNotes'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Orders = lazy(() => import('./pages/Orders'));
const Tasks = lazy(() => import('./pages/Tasks'));
const TaskDetail = lazy(() => import('./pages/TaskDetail'));
const Messages = lazy(() => import('./pages/Messages'));
const Notifications = lazy(() => import('./pages/Notifications'));
const CriticalResults = lazy(() => import('./pages/CriticalResults'));
const EmergencyCare = lazy(() => import('./pages/EmergencyCare'));
const HospitalWorkflows = lazy(() => import('./pages/HospitalWorkflows'));
const FluidBalance = lazy(() => import('./pages/FluidBalance'));
const Telemedicine = lazy(() => import('./pages/Telemedicine'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));
const Help = lazy(() => import('./pages/Help'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const Index = lazy(() => import('./pages/Index'));

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster position="top-right" />
        <Router>
          <Suspense 
            fallback={
              <div className="min-h-screen flex justify-center items-center bg-background">
                <div className="animate-pulse">Carregando...</div>
              </div>
            }
          >
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<Index />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/patient/:id" element={<PatientProfile />} />
                <Route path="/vitals/:patientId?" element={<VitalSigns />} />
                <Route path="/medical-history/:patientId?" element={<MedicalHistory />} />
                <Route path="/prescriptions" element={<Prescriptions />} />
                <Route path="/prescribe" element={<PrescribeMedication />} />
                <Route path="/prescription/:id" element={<PrescriptionView />} />
                <Route path="/medications" element={<Medications />} />
                <Route path="/medication/:id" element={<MedicationView />} />
                <Route path="/medication-admin" element={<MedicationAdministration />} />
                <Route path="/rxnorm-management" element={<RxNormManagement />} />
                <Route path="/records" element={<Records />} />
                <Route path="/record/:id" element={<RecordView />} />
                <Route path="/clinical-documentation" element={<ClinicalDocumentation />} />
                <Route path="/visit-notes" element={<VisitNotes />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/task/:id" element={<TaskDetail />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/critical-results" element={<CriticalResults />} />
                <Route path="/emergency-care" element={<EmergencyCare />} />
                <Route path="/hospital-workflows" element={<HospitalWorkflows />} />
                <Route path="/fluid-balance" element={<FluidBalance />} />
                <Route path="/telemedicine" element={<Telemedicine />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/help" element={<Help />} />
              </Route>
              
              {/* Error routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
