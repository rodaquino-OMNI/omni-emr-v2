
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useSectorContext } from '@/hooks/useSectorContext';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { selectedSector } = useSectorContext();
  
  // If no sector is selected, redirect to sector selection
  useEffect(() => {
    if (!selectedSector) {
      navigate('/sectors');
    }
  }, [selectedSector, navigate]);
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
