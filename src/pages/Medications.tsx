
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MedicationsList from '../components/medications/MedicationsList';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,

  SheetTrigger 
} from '@/components/ui/sheet';
import NewMedicationForm from '../components/medications/NewMedicationForm';

const MedicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewMedicationOpen, setIsNewMedicationOpen] = useState(false);
  const { language } = useTranslation();
  
  const statuses = [
    { value: 'all', label: language === 'pt' ? 'Todos os Medicamentos' : 'All Medications' },
    { value: 'active', label: language === 'pt' ? 'Ativos' : 'Active' },
    { value: 'discontinued', label: language === 'pt' ? 'Descontinuados' : 'Discontinued' },
    { value: 'scheduled', label: language === 'pt' ? 'Agendados' : 'Scheduled' },
  ];

  const handleMedicationCreated = () => {
    setIsNewMedicationOpen(false);
    // We could refresh the medications list here
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
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
                {language === 'pt' ? 'Medicamentos' : 'Medications'}
              </h1>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={language === 'pt' ? "Buscar medicamentos..." : "Search medications..."}
                    className="w-full h-9 pl-3 pr-3 rounded-md border border-border bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select
                  value={statusFilter}
                  onValueChange={handleStatusFilterChange}
                >
                  <SelectTrigger className="h-9 w-[180px]">
                    <SelectValue placeholder={language === 'pt' ? "Filtrar por status" : "Filter by status"} />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Sheet open={isNewMedicationOpen} onOpenChange={setIsNewMedicationOpen}>
                  <SheetTrigger asChild>
                    <Button className="h-9 flex items-center gap-1">
                      <PlusCircle className="h-4 w-4" />
                      {language === 'pt' ? 'Novo Medicamento' : 'New Medication'}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>
                        {language === 'pt' ? 'Adicionar Novo Medicamento' : 'Add New Medication'}
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <NewMedicationForm 
                        onSuccess={handleMedicationCreated} 
                        onCancel={() => setIsNewMedicationOpen(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <MedicationsList searchTerm={searchTerm} statusFilter={statusFilter} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedicationsPage;
