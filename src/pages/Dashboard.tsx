
import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Dashboard from '../components/dashboard/Dashboard';

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
