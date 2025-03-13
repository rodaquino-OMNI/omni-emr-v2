
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import RecordsList from '../components/records/RecordsList';
import { FilePlus } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import NewRecordForm from '../components/records/NewRecordForm';

const RecordsPage = () => {
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  
  const recordTypes = [
    { value: 'all', label: language === 'pt' ? 'Todos os Registros' : 'All Records' },
    { value: 'lab', label: language === 'pt' ? 'Resultados de Laboratório' : 'Lab Results' },
    { value: 'imaging', label: language === 'pt' ? 'Imagens' : 'Imaging' },
    { value: 'procedure', label: language === 'pt' ? 'Procedimentos' : 'Procedures' },
    { value: 'visit', label: language === 'pt' ? 'Notas de Visita' : 'Visit Notes' },
    { value: 'discharge', label: language === 'pt' ? 'Resumo de Alta' : 'Discharge Summary' },
  ];

  const handleRecordCreated = () => {
    setIsNewRecordOpen(false);
    // We could refresh the records list here
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
                {language === 'pt' ? 'Registros Médicos' : 'Medical Records'}
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'pt' ? "Buscar registros..." : "Search records..."}
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
                
                <Sheet open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
                  <SheetTrigger asChild>
                    <Button className="h-9 flex items-center gap-1">
                      <FilePlus className="h-4 w-4" />
                      {language === 'pt' ? 'Novo Registro' : 'New Record'}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>
                        {language === 'pt' ? 'Criar Novo Registro Médico' : 'Create New Medical Record'}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <NewRecordForm 
                        onSuccess={handleRecordCreated} 
                        onCancel={() => setIsNewRecordOpen(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <RecordsList searchTerm={searchTerm} typeFilter={typeFilter} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecordsPage;
