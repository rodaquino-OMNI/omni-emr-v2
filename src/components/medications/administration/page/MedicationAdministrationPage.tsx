
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { useTranslation } from '@/hooks/useTranslation';
import PatientListSection from './PatientListSection';
import MedicationDetailSection from './MedicationDetailSection';
import PageHeader from './PageHeader';

const MedicationAdministrationPage = () => {
  const { language } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [scanMode, setScanMode] = useState(false);
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <PageHeader 
              scanMode={scanMode} 
              setScanMode={setScanMode} 
              language={language}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <PatientListSection 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedPatient={selectedPatient}
                setSelectedPatient={setSelectedPatient}
              />
              
              <MedicationDetailSection 
                selectedPatient={selectedPatient}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                language={language}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicationAdministrationPage;
