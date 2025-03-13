
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import PatientList from '../components/patients/PatientList';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '../hooks/useTranslation';

const PatientsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useTranslation();
  
  // Get status from URL query params
  const queryParams = new URLSearchParams(location.search);
  const statusFromUrl = queryParams.get('status') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(statusFromUrl);
  
  const statuses = [
    { value: 'all', label: language === 'pt' ? 'Todos os Pacientes' : 'All Patients' },
    { value: 'hospital', label: language === 'pt' ? 'Internados' : 'Hospital' },
    { value: 'home', label: language === 'pt' ? 'Em Casa' : 'Home Care' },
    { value: 'critical', label: language === 'pt' ? 'Críticos' : 'Critical' },
    { value: 'stable', label: language === 'pt' ? 'Estáveis' : 'Stable' },
    { value: 'improving', label: language === 'pt' ? 'Melhorando' : 'Improving' },
    { value: 'discharged', label: language === 'pt' ? 'Alta' : 'Discharged' },
  ];

  // Update URL when filter changes
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    
    if (newStatus === 'all') {
      navigate('/patients');
    } else {
      navigate(`/patients?status=${newStatus}`);
    }
  };

  const handleNewPatient = () => {
    // For now, just navigate to the first patient as a placeholder
    // In a real app, this would open a form to create a new patient
    navigate('/patients/1');
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">
                {language === 'pt' ? 'Pacientes' : 'Patients'}
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'pt' ? "Buscar pacientes..." : "Search patients..."}
                    className="w-full h-9 pl-3 pr-3 rounded-md border border-border bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="h-9 rounded-md border border-border bg-background pl-3 pr-8 text-sm"
                  value={statusFilter}
                  onChange={handleStatusChange}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                
                <Button onClick={handleNewPatient} className="h-9 flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  {language === 'pt' ? 'Novo Paciente' : 'New Patient'}
                </Button>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <PatientList statusFilter={statusFilter} searchTerm={searchTerm} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientsPage;
