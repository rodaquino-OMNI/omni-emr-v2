
import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MedicationsList from '../components/medications/MedicationsList';
import { PlusCircle, Filter } from 'lucide-react';

const MedicationsPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  
  const statuses = [
    { value: 'all', label: 'All Medications' },
    { value: 'active', label: 'Active' },
    { value: 'discontinued', label: 'Discontinued' },
    { value: 'scheduled', label: 'Scheduled' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">Medications</h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search medications..."
                    className="w-full h-9 pl-3 pr-3 rounded-md border border-border bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="h-9 rounded-md border border-border bg-background pl-3 pr-8 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                
                <button className="h-9 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  New Medication
                </button>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <MedicationsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicationsPage;
