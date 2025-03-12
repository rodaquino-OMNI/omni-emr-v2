
import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import RecordsList from '../components/records/RecordsList';
import { FilePlus, Filter } from 'lucide-react';

const RecordsPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  
  const recordTypes = [
    { value: 'all', label: 'All Records' },
    { value: 'lab', label: 'Lab Results' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'procedure', label: 'Procedures' },
    { value: 'visit', label: 'Visit Notes' },
    { value: 'discharge', label: 'Discharge Summary' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl font-semibold">Medical Records</h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search records..."
                    className="w-full h-9 pl-3 pr-3 rounded-md border border-border bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="h-9 rounded-md border border-border bg-background pl-3 pr-8 text-sm"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  {recordTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                
                <button className="h-9 bg-primary text-white rounded-md px-4 text-sm font-medium flex items-center gap-1">
                  <FilePlus className="h-4 w-4" />
                  New Record
                </button>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <RecordsList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecordsPage;
