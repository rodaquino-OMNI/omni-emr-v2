import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import Records from "./pages/Records";
import RecordView from "./pages/RecordView";
import Medications from "./pages/Medications";
import MedicationView from "./pages/MedicationView";
import PrescribeMedication from "./pages/PrescribeMedication";
import Prescriptions from "./pages/Prescriptions";
import PrescriptionView from "./pages/PrescriptionView";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Telemedicine from "./pages/Telemedicine";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import MedicalHistory from "./pages/MedicalHistory";
import Notifications from "./pages/Notifications";
import VitalSigns from "./pages/VitalSigns";
import FluidBalance from "./pages/FluidBalance";
import Orders from './pages/Orders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner closeButton position="top-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                
                <Route path="/patients" element={<Patients />} />
                <Route path="/patients/:id" element={<PatientProfile />} />
                <Route path="/patients/:id/medical-history" element={<MedicalHistory />} />
                
                <Route path="/records" element={<Records />} />
                <Route path="/records/:id" element={<RecordView />} />
                
                <Route path="/medications" element={<Medications />} />
                <Route path="/medications/:id" element={<MedicationView />} />
                
                <Route path="/prescriptions" element={<Prescriptions />} />
                <Route path="/prescriptions/:id" element={<PrescriptionView />} />
                
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                
                <Route path="/vitals" element={<VitalSigns />} />
                <Route path="/fluid-balance" element={<FluidBalance />} />
                
                <Route element={<ProtectedRoute requiredPermission="prescribe_medications" />}>
                  <Route path="/prescribe/:patientId?" element={<PrescribeMedication />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredPermission="telemedicine" />}>
                  <Route path="/telemedicine" element={<Telemedicine />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredPermission="view_schedule" />}>
                  <Route path="/schedule" element={<Schedule />} />
                </Route>
                
                <Route element={<ProtectedRoute requiredPermission="all" />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>
                
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                
                <Route path="/orders" element={<Orders />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
