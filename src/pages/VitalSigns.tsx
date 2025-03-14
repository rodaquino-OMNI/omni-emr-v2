
import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';

const VitalSigns = () => {
  const { language } = useTranslation();
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-6">
              {language === 'pt' ? 'Sinais Vitais' : 'Vital Signs'}
            </h1>
            <div className="glass-card p-6">
              <p className="text-muted-foreground">
                {language === 'pt' 
                  ? 'Módulo de Sinais Vitais para monitoramento de pacientes' 
                  : 'Vital Signs module for patient monitoring'}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VitalSigns;
