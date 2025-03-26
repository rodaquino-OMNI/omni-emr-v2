import React, { useState } from 'react';
import MedicationsList from '../components/medications/MedicationsList';
import { PlusCircle, Layers, AlertCircle, History, Activity } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewMedicationForm from '../components/medications/NewMedicationForm';
import DrugInteractionChecker from '../components/medications/drugInteractions/DrugInteractionChecker';
import MedicationReconciliation from '../components/medications/reconciliation/MedicationReconciliation';
import { usePatient } from '../hooks/usePatient';
import { useAuth } from '@/context/AuthContext';
import { canPerformMedicationAction } from '@/utils/permissions/medicationManagement';

const MedicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewMedicationOpen, setIsNewMedicationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const { language } = useTranslation();
  const { patient } = usePatient();
  const { user } = useAuth();
  
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

  // Check if user can prescribe medications
  const canPrescribe = user ? canPerformMedicationAction(user, 'prescribe') : false;

  return (
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
          
          <NewMedicationForm
            open={isNewMedicationOpen}
            onOpenChange={setIsNewMedicationOpen}
            onSubmit={(data) => {
              console.log('New medication data:', data);
              handleMedicationCreated();
            }}
          />
          
          {canPrescribe && (
            <Button 
              className="h-9 flex items-center gap-1"
              onClick={() => setIsNewMedicationOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              {language === 'pt' ? 'Novo Medicamento' : 'New Medication'}
            </Button>
          )}
        </div>
      </div>
      
      {patient && patient.allergies && patient.allergies.length > 0 && (
        <Alert variant="warning" className="mb-4 bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'pt' ? 'Alergias do Paciente' : 'Patient Allergies'}
          </AlertTitle>
          <AlertDescription className="flex flex-wrap gap-2 mt-2">
            {patient.allergies.map((allergy, idx) => (
              <Badge key={idx} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                {allergy}
              </Badge>
            ))}
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {language === 'pt' ? 'Medicações Atuais' : 'Current Medications'}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {language === 'pt' ? 'Histórico' : 'Medication History'}
          </TabsTrigger>
          <TabsTrigger value="interactions" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {language === 'pt' ? 'Interações' : 'Interactions'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <Card className="glass-card p-6 border border-border">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {language === 'pt' ? 'Medicações Atuais' : 'Current Medications'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <MedicationsList 
                searchTerm={searchTerm} 
                statusFilter={activeTab === 'current' ? 'active' : statusFilter} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card className="glass-card p-6 border border-border">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                {language === 'pt' ? 'Histórico de Medicações' : 'Medication History'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <MedicationReconciliation patientId={patient?.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interactions" className="space-y-4">
          <DrugInteractionChecker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationsPage;
