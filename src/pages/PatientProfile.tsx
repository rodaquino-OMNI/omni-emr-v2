
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import PatientDetail from '../components/patients/PatientDetail';
import { ArrowLeft, Edit, Printer } from 'lucide-react';

const PatientProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Patient not found</div>;
  }
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Link to="/patients" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to patients</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="h-9 border border-border rounded-md px-4 text-sm font-medium flex items-center gap-1">
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button className="h-9 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </div>
            </div>
            
            <PatientDetail patientId={id} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientProfilePage;
