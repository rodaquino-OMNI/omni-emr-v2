
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { ArrowLeft } from 'lucide-react';
import PatientHeader from '../components/patients/PatientHeader';
import PatientMedicalHistory from '../components/patients/PatientMedicalHistory';
import { samplePatients } from '../data/samplePatients';

const MedicalHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Patient not found</div>;
  }
  
  const patient = samplePatients.find(p => p.id === id);
  
  if (!patient) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full">
              <div className="text-center py-8">
                <h2 className="text-xl font-medium text-muted-foreground">Patient not found</h2>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center gap-2 mb-6">
              <Link to={`/patients/${id}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to patient</span>
              </Link>
            </div>
            
            <PatientHeader patient={patient} hasCriticalInsights={false} />
            
            <div className="mt-6">
              <PatientMedicalHistory patientId={id} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
