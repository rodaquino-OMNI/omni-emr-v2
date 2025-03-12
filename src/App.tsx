
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import PatientProfile from "./pages/PatientProfile";
import Records from "./pages/Records";
import RecordView from "./pages/RecordView";
import Medications from "./pages/Medications";
import MedicationView from "./pages/MedicationView";
import PrescribeMedication from "./pages/PrescribeMedication";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Telemedicine from "./pages/Telemedicine";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientProfile />} />
              
              <Route path="/records" element={<Records />} />
              <Route path="/records/:id" element={<RecordView />} />
              
              <Route path="/medications" element={<Medications />} />
              <Route path="/medications/:id" element={<MedicationView />} />
              
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
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
