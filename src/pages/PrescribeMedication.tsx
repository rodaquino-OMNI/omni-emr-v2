
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { PrescriptionItem, createPrescription } from '../services/prescriptionService';
import { ArrowLeft, Save, Pill, AlertTriangle, Plus, Trash2, Search } from 'lucide-react';

type PrescriptionFormState = {
  patientId: string;
  patientName: string;
  notes: string;
  items: PrescriptionItem[];
};

type CurrentItem = Omit<PrescriptionItem, 'id' | 'status'> & { index?: number };

const PrescribeMedicationPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const { user } = useAuth();
  
  const canPrescribe = user?.role === 'doctor' || user?.role === 'admin' || 
                      (user?.permissions && user.permissions.includes('prescribe_medications'));
  
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionFormState>({
    patientId: patientId || '',
    patientName: '',
    notes: '',
    items: []
  });
  
  const [currentItem, setCurrentItem] = useState<CurrentItem>({
    name: '',
    type: 'medication',
    details: '',
    dosage: '',
    frequency: '',
    duration: '',
    startDate: '',
    endDate: '',
    instructions: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const [activeTab, setActiveTab] = useState<string>('medication');
  
  useEffect(() => {
    if (patientId) {
      setPrescriptionData(prev => ({
        ...prev,
        patientId,
        patientName: `Patient ${patientId}`
      }));
    }
  }, [patientId]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentItem(prev => ({
      ...prev,
      type: value as PrescriptionItem['type'],
      dosage: value === 'medication' ? prev.dosage : '',
      frequency: ['medication', 'procedure'].includes(value) ? prev.frequency : '',
      duration: ['medication', 'procedure'].includes(value) ? prev.duration : ''
    }));
  };
  
  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrescriptionData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name' && value.length >= 3 && currentItem.type === 'medication') {
      searchMedications(value);
    }
    
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  const searchMedications = (term: string) => {
    const mockResults = [
      { id: 1, name: 'Acetaminophen 500mg Tablet', generic: 'Acetaminophen', rxnorm: '198440' },
      { id: 2, name: 'Ibuprofen 400mg Tablet', generic: 'Ibuprofen', rxnorm: '310965' },
      { id: 3, name: 'Amoxicillin 500mg Capsule', generic: 'Amoxicillin', rxnorm: '308182' },
      { id: 4, name: 'Lisinopril 10mg Tablet', generic: 'Lisinopril', rxnorm: '314076' },
      { id: 5, name: 'Atorvastatin 20mg Tablet', generic: 'Atorvastatin', rxnorm: '259255' },
      { id: 6, name: 'Metformin 500mg Tablet', generic: 'Metformin', rxnorm: '861007' },
      { id: 7, name: 'Sertraline 50mg Tablet', generic: 'Sertraline', rxnorm: '312940' },
      { id: 8, name: 'Albuterol 90mcg Inhaler', generic: 'Albuterol', rxnorm: '801095' }
    ].filter(med => 
      med.name.toLowerCase().includes(term.toLowerCase()) || 
      med.generic.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(mockResults);
    setShowSearch(term.length > 1);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      searchMedications(term);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };
  
  const selectMedication = (medication: any) => {
    setCurrentItem(prev => ({
      ...prev,
      name: medication.name,
      rxnormCode: medication.rxnorm,
      fhirMedication: {
        coding: [{
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: medication.rxnorm,
          display: medication.name
        }],
        text: medication.name
      }
    }));
    setSearchTerm(medication.name);
    setShowSearch(false);
  };
  
  const handleAddItem = () => {
    if (!currentItem.name) {
      toast({
        title: "Item name is required",
        description: "Please enter a name for the item."
      });
      return;
    }
    
    const newItem: PrescriptionItem = {
      id: currentItem.index !== undefined ? prescriptionData.items[currentItem.index].id : crypto.randomUUID(),
      name: currentItem.name,
      type: currentItem.type,
      details: currentItem.details || undefined,
      dosage: currentItem.dosage || undefined,
      frequency: currentItem.frequency || undefined,
      duration: currentItem.duration || undefined,
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      instructions: currentItem.instructions || undefined,
      status: 'pending'
    };
    
    if (currentItem.index !== undefined) {
      const updatedItems = [...prescriptionData.items];
      updatedItems[currentItem.index] = newItem;
      setPrescriptionData(prev => ({ ...prev, items: updatedItems }));
    } else {
      setPrescriptionData(prev => ({ 
        ...prev, 
        items: [...prev.items, newItem] 
      }));
    }
    
    setCurrentItem({
      name: '',
      type: activeTab as PrescriptionItem['type'],
      details: '',
      dosage: '',
      frequency: '',
      duration: '',
      startDate: '',
      endDate: '',
      instructions: ''
    });
    
    setStartDate(new Date());
    setEndDate(undefined);
    
    toast({
      title: `${newItem.name} added to prescription`,
      description: "The item has been successfully added to the prescription."
    });
  };
  
  const handleEditItem = (index: number) => {
    const item = prescriptionData.items[index];
    setActiveTab(item.type);
    setCurrentItem({
      name: item.name,
      type: item.type,
      details: item.details || '',
      dosage: item.dosage || '',
      frequency: item.frequency || '',
      duration: item.duration || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      instructions: item.instructions || '',
      index
    });
    
    if (item.startDate) {
      setStartDate(new Date(item.startDate));
    }
    
    if (item.endDate) {
      setEndDate(new Date(item.endDate));
    }
  };
  
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...prescriptionData.items];
    updatedItems.splice(index, 1);
    setPrescriptionData(prev => ({ ...prev, items: updatedItems }));
    
    toast({
      title: "Item removed",
      description: "The item has been removed from the prescription."
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canPrescribe) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to prescribe medications.",
        variant: "destructive"
      });
      return;
    }
    
    if (prescriptionData.items.length === 0) {
      toast({
        title: "No Items",
        description: "Please add at least one item to the prescription.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createPrescription({
        patientId: prescriptionData.patientId,
        patientName: prescriptionData.patientName,
        doctorId: user?.id || '',
        doctorName: user?.name || '',
        date: new Date().toISOString(),
        items: prescriptionData.items,
        status: 'active',
        notes: prescriptionData.notes
      }, user!);
      
      toast({
        title: "Prescription created successfully",
        description: "The prescription has been successfully created.",
        variant: "success"
      });
      
      if (patientId) {
        navigate(`/patients/${patientId}`);
      } else {
        navigate('/prescriptions');
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast({
        title: "Failed to create prescription",
        description: "Failed to create the prescription.",
        variant: "destructive"
      });
    }
  };
  
  if (!canPrescribe) {
    return (
      <div className="min-h-screen flex bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
            <div className="max-w-6xl mx-auto w-full">
              <div className="mb-6">
                <Button 
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mb-2"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Voltar' : 'Back'}
                </Button>
                <h1 className="text-2xl font-semibold">No Permission</h1>
              </div>
              
              <div className="glass-card p-6">
                <div className="text-center p-4">
                  <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Permission Denied</h2>
                  <p className="text-muted-foreground mb-4">
                    You don't have permission to prescribe medications.
                  </p>
                  <Button onClick={() => navigate(-1)}>
                    Go Back
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="mb-6">
              <Button 
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'pt' ? 'Voltar' : 'Back'}
              </Button>
              <h1 className="text-2xl font-semibold">{language === 'pt' ? 'Prescrever Medicamentos' : 'Prescribe Medication'}</h1>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-lg font-medium mb-4">{language === 'pt' ? 'Informações do Paciente' : 'Patient Information'}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="patientId">
                        {language === 'pt' ? 'ID do Paciente *' : 'Patient ID *'}
                      </Label>
                      <Input
                        id="patientId"
                        name="patientId"
                        required
                        value={prescriptionData.patientId}
                        onChange={handlePrescriptionChange}
                        readOnly={!!patientId}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="patientName">
                        {language === 'pt' ? 'Nome do Paciente *' : 'Patient Name *'}
                      </Label>
                      <Input
                        id="patientName"
                        name="patientName"
                        required
                        value={prescriptionData.patientName}
                        onChange={handlePrescriptionChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-6">
                  <h2 className="text-lg font-medium mb-4">{language === 'pt' ? 'Itens da Prescrição' : 'Prescription Items'}</h2>
                  
                  <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="medication">{language === 'pt' ? 'Medicamento' : 'Medication'}</TabsTrigger>
                      <TabsTrigger value="procedure">{language === 'pt' ? 'Procedimento' : 'Procedure'}</TabsTrigger>
                      <TabsTrigger value="lab_test">{language === 'pt' ? 'Exame Laboratorial' : 'Lab Test'}</TabsTrigger>
                      <TabsTrigger value="imaging">{language === 'pt' ? 'Imagem' : 'Imaging'}</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="medication">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="medication-search">
                            {language === 'pt' ? 'Buscar Medicamento' : 'Search Medication'}
                          </Label>
                          <div className="relative">
                            <Input
                              id="medication-search"
                              placeholder={language === 'pt' ? 'Digite para buscar...' : 'Type to search...'}
                              value={searchTerm}
                              onChange={handleSearchChange}
                              className="pr-10"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            
                            {showSearch && searchResults.length > 0 && (
                              <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
                                <ul className="py-1 max-h-60 overflow-auto">
                                  {searchResults.map((med) => (
                                    <li 
                                      key={med.id}
                                      className="px-3 py-2 hover:bg-muted cursor-pointer"
                                      onClick={() => selectMedication(med)}
                                    >
                                      <div className="font-medium">{med.name}</div>
                                      <div className="text-xs text-muted-foreground">{med.generic}</div>
                                      {med.rxnorm && (
                                        <div className="text-xs text-blue-600">RxNorm: {med.rxnorm}</div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="dosage">
                              {language === 'pt' ? 'Dosagem *' : 'Dosage *'}
                            </Label>
                            <Input
                              id="dosage"
                              name="dosage"
                              placeholder={language === 'pt' ? 'Ex: 500mg' : 'Ex: 500mg'}
                              value={currentItem.dosage}
                              onChange={handleItemChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <Label htmlFor="frequency">
                              {language === 'pt' ? 'Frequência *' : 'Frequency *'}
                            </Label>
                            <select
                              id="frequency"
                              name="frequency"
                              className="w-full h-10 px-3 rounded-md border border-border bg-background"
                              required
                              value={currentItem.frequency}
                              onChange={handleItemChange}
                            >
                              <option value="">{language === 'pt' ? 'Selecionar Frequência' : 'Select Frequency'}</option>
                              <option value="Once daily">{language === 'pt' ? 'Uma vez ao dia' : 'Once daily'}</option>
                              <option value="Twice daily">{language === 'pt' ? 'Duas vezes ao dia' : 'Twice daily'}</option>
                              <option value="Three times daily">{language === 'pt' ? 'Três vezes ao dia' : 'Three times daily'}</option>
                              <option value="Four times daily">{language === 'pt' ? 'Quatro vezes ao dia' : 'Four times daily'}</option>
                              <option value="Every morning">{language === 'pt' ? 'Todas as manhãs' : 'Every morning'}</option>
                              <option value="Every evening">{language === 'pt' ? 'Todas as noites' : 'Every evening'}</option>
                              <option value="Every 4 hours">{language === 'pt' ? 'A cada 4 horas' : 'Every 4 hours'}</option>
                              <option value="Every 6 hours">{language === 'pt' ? 'A cada 6 horas' : 'Every 6 hours'}</option>
                              <option value="Every 8 hours">{language === 'pt' ? 'A cada 8 horas' : 'Every 8 hours'}</option>
                              <option value="As needed">{language === 'pt' ? 'Conforme necessário' : 'As needed'}</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="duration">
                              {language === 'pt' ? 'Duração' : 'Duration'}
                            </Label>
                            <Input
                              id="duration"
                              name="duration"
                              placeholder={language === 'pt' ? 'Ex: 10 dias, 2 semanas' : 'e.g., 10 days, 2 weeks'}
                              value={currentItem.duration}
                              onChange={handleItemChange}
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <Label>
                              {language === 'pt' ? 'Data de Início *' : 'Start Date *'}
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {startDate ? format(startDate, 'PPP') : (language === 'pt' ? 'Selecionar data' : 'Select date')}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label>
                              {language === 'pt' ? 'Data de Término' : 'End Date'}
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {endDate ? format(endDate, 'PPP') : (language === 'pt' ? 'Selecionar data' : 'Select date')}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={endDate}
                                  onSelect={setEndDate}
                                  disabled={(date) => date < (startDate || new Date())}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        <div className="space-y-1.5">
                          <Label htmlFor="instructions">
                            {language === 'pt' ? 'Instruções *' : 'Instructions *'}
                          </Label>
                          <Textarea
                            id="instructions"
                            name="instructions"
                            placeholder={language === 'pt' ? 'Ex: Tomar com alimentos' : 'Ex: Take with food'}
                            value={currentItem.instructions}
                            onChange={handleItemChange}
                            required
                          />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="procedure">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            {language === 'pt' ? 'Nome do Procedimento *' : 'Procedure Name *'}
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            required
                            value={currentItem.name}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="details">
                            {language === 'pt' ? 'Detalhes' : 'Details'}
                          </Label>
                          <Input
                            id="details"
                            name="details"
                            value={currentItem.details}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="frequency">
                            {language === 'pt' ? 'Frequência' : 'Frequency'}
                          </Label>
                          <Input
                            id="frequency"
                            name="frequency"
                            value={currentItem.frequency}
                            onChange={handleItemChange}
                            placeholder={language === 'pt' ? 'Ex: Uma vez por semana' : 'e.g., Once weekly'}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="duration">
                            {language === 'pt' ? 'Duração' : 'Duration'}
                          </Label>
                          <Input
                            id="duration"
                            name="duration"
                            value={currentItem.duration}
                            onChange={handleItemChange}
                            placeholder={language === 'pt' ? 'Ex: 4 semanas' : 'e.g., 4 weeks'}
                          />
                        </div>
                        
                        <div className="space-y-1.5">
                          <Label>
                            {language === 'pt' ? 'Data de Início' : 'Start Date'}
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, 'PPP') : (language === 'pt' ? 'Selecionar data' : 'Select date')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="instructions">
                          {language === 'pt' ? 'Instruções *' : 'Instructions *'}
                        </Label>
                        <Textarea
                          id="instructions"
                          name="instructions"
                          rows={3}
                          required
                          value={currentItem.instructions}
                          onChange={handleItemChange}
                          placeholder={language === 'pt' ? 'Instruções especiais para o procedimento' : 'Special instructions for the procedure'}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="lab_test">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            {language === 'pt' ? 'Nome do Exame *' : 'Lab Test Name *'}
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            required
                            value={currentItem.name}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="details">
                            {language === 'pt' ? 'Detalhes' : 'Details'}
                          </Label>
                          <Input
                            id="details"
                            name="details"
                            value={currentItem.details}
                            onChange={handleItemChange}
                            placeholder={language === 'pt' ? 'Detalhes específicos para este exame' : 'Any specific details for this test'}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="instructions">
                          {language === 'pt' ? 'Instruções' : 'Instructions'}
                        </Label>
                        <Textarea
                          id="instructions"
                          name="instructions"
                          rows={3}
                          value={currentItem.instructions}
                          onChange={handleItemChange}
                          placeholder={language === 'pt' ? 'Ex: Jejum necessário' : 'E.g., Fasting required'}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="imaging">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            {language === 'pt' ? 'Nome do Exame de Imagem *' : 'Imaging Study Name *'}
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            required
                            value={currentItem.name}
                            onChange={handleItemChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="details">
                            {language === 'pt' ? 'Detalhes' : 'Details'}
                          </Label>
                          <Input
                            id="details"
                            name="details"
                            value={currentItem.details}
                            onChange={handleItemChange}
                            placeholder={language === 'pt' ? 'Ex: Com contraste' : 'E.g., With contrast'}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="instructions">
                          {language === 'pt' ? 'Instruções' : 'Instructions'}
                        </Label>
                        <Textarea
                          id="instructions"
                          name="instructions"
                          rows={3}
                          value={currentItem.instructions}
                          onChange={handleItemChange}
                          placeholder={language === 'pt' ? 'Instruções especiais para o exame' : 'Special instructions for the imaging study'}
                        />
                      </div>
                    </TabsContent>
                    
                    <div className="flex justify-end mt-2">
                      <Button 
                        type="button" 
                        onClick={handleAddItem}
                        className="flex items-center"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {currentItem.index !== undefined ? 
                         (language === 'pt' ? 'Atualizar Item' : 'Update Item') : 
                         (language === 'pt' ? 'Adicionar Item' : 'Add Item')}
                      </Button>
                    </div>
                  </Tabs>
                  
                  {prescriptionData.items.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">{language === 'pt' ? 'Itens Adicionados' : 'Added Items'}</h3>
                      <div className="space-y-3">
                        {prescriptionData.items.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-md bg-background">
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground capitalize">{
                                item.type === 'medication' ? (language === 'pt' ? 'Medicamento' : 'Medication') :
                                item.type === 'procedure' ? (language === 'pt' ? 'Procedimento' : 'Procedure') :
                                item.type === 'lab_test' ? (language === 'pt' ? 'Exame Laboratorial' : 'Lab Test') :
                                (language === 'pt' ? 'Imagem' : 'Imaging')
                              }</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditItem(index)}
                              >
                                <Pill className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="glass-card p-6">
                  <h2 className="text-lg font-medium mb-4">{language === 'pt' ? 'Notas Adicionais' : 'Additional Notes'}</h2>
                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      {language === 'pt' ? 'Notas' : 'Notes'}
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={prescriptionData.notes}
                      onChange={handlePrescriptionChange}
                      placeholder={language === 'pt' ? 'Quaisquer notas ou comentários adicionais' : 'Any additional notes or comments'}
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6 dark:bg-yellow-900/20 dark:border-yellow-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-400">{language === 'pt' ? 'Aviso Importante' : 'Important Notice'}</h4>
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-300">
                    {language === 'pt' 
                      ? 'Verifique todos os detalhes da prescrição antes de salvar. Verifique possíveis interações medicamentosas e alergias.'
                      : 'Please verify all prescription details before saving. Check for potential drug interactions and allergies.'}
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    {language === 'pt' ? 'Cancelar' : 'Cancel'}
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    {language === 'pt' ? 'Salvar Prescrição' : 'Save Prescription'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescribeMedicationPage;
