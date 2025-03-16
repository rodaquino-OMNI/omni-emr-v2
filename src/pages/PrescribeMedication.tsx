
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, PlusCircle, Trash2, Info, AlertTriangle, AlertCircle, Search, RotateCcw, Calculator } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PrescriptionItem } from '@/types/patientTypes';
import { RxNormMedicationSelector } from '@/components/medications/RxNormMedicationSelector';
import { MedicationAutocomplete } from '@/components/medications/MedicationAutocomplete';
import { useMedicationSafety } from '@/hooks/useMedicationSafety';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { checkMedicationAllergies, checkDrugInteractions } from '@/services/prescriptionService';

interface CurrentItem extends PrescriptionItem {
  isNew?: boolean;
  details?: any;
}

interface FrequencyOption {
  value: string;
  label: string;
  timesPerDay: number;
}

interface RouteOption {
  value: string;
  label: string;
  bioavailability?: number;
}

const PrescribeMedication = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { language } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patientName, setPatientName] = useState('');
  const [items, setItems] = useState<CurrentItem[]>([]);
  const [currentItem, setCurrentItem] = useState<CurrentItem>({
    id: '',
    prescription_id: '',
    name: '',
    type: 'medication',
    status: 'pending',
    dosage: '',
    frequency: '',
    duration: '7 days',
    instructions: '',
    details: {}
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRxNormModalOpen, setIsRxNormModalOpen] = useState(false);
  const [isDoseCalculatorOpen, setIsDoseCalculatorOpen] = useState(false);
  const [patientWeight, setPatientWeight] = useState<number | null>(null);
  const [patientAgeMos, setPatientAgeMos] = useState<number | null>(null);
  
  // Medication safety check related states
  const [allergyCheckResult, setAllergyCheckResult] = useState<any[]>([]);
  const [interactionCheckResult, setInteractionCheckResult] = useState<any[]>([]);
  const [isAllergyChecking, setIsAllergyChecking] = useState(false);
  const [isInteractionChecking, setIsInteractionChecking] = useState(false);
  const [showSafetyWarning, setShowSafetyWarning] = useState(false);

  const { performSafetyCheck, allergies, isLoadingAllergies, markAllergiesReviewed } = 
    useMedicationSafety(patientId || '');

  // Frequency options
  const frequencyOptions: FrequencyOption[] = [
    { value: 'once_daily', label: language === 'pt' ? 'Uma vez ao dia' : 'Once daily', timesPerDay: 1 },
    { value: 'twice_daily', label: language === 'pt' ? 'Duas vezes ao dia' : 'Twice daily', timesPerDay: 2 },
    { value: 'three_times_daily', label: language === 'pt' ? 'Três vezes ao dia' : 'Three times daily', timesPerDay: 3 },
    { value: 'four_times_daily', label: language === 'pt' ? 'Quatro vezes ao dia' : 'Four times daily', timesPerDay: 4 },
    { value: 'every_morning', label: language === 'pt' ? 'Toda manhã' : 'Every morning', timesPerDay: 1 },
    { value: 'every_night', label: language === 'pt' ? 'Toda noite' : 'Every night at bedtime', timesPerDay: 1 },
    { value: 'every_other_day', label: language === 'pt' ? 'Dia sim, dia não' : 'Every other day', timesPerDay: 0.5 },
    { value: 'as_needed', label: language === 'pt' ? 'Conforme necessário' : 'As needed (PRN)', timesPerDay: 0 },
    { value: 'weekly', label: language === 'pt' ? 'Semanalmente' : 'Weekly', timesPerDay: 1/7 },
    { value: 'monthly', label: language === 'pt' ? 'Mensalmente' : 'Monthly', timesPerDay: 1/30 }
  ];

  // Route options
  const routeOptions: RouteOption[] = [
    { value: 'oral', label: language === 'pt' ? 'Via oral' : 'Oral', bioavailability: 1 },
    { value: 'iv', label: language === 'pt' ? 'Intravenoso' : 'Intravenous', bioavailability: 1 },
    { value: 'im', label: language === 'pt' ? 'Intramuscular' : 'Intramuscular', bioavailability: 0.9 },
    { value: 'sc', label: language === 'pt' ? 'Subcutâneo' : 'Subcutaneous', bioavailability: 0.8 },
    { value: 'topical', label: language === 'pt' ? 'Tópico' : 'Topical', bioavailability: 0.1 },
    { value: 'rectal', label: language === 'pt' ? 'Retal' : 'Rectal', bioavailability: 0.7 },
    { value: 'nasal', label: language === 'pt' ? 'Nasal' : 'Nasal', bioavailability: 0.5 },
    { value: 'inhalation', label: language === 'pt' ? 'Inalação' : 'Inhalation', bioavailability: 0.6 },
    { value: 'sublingual', label: language === 'pt' ? 'Sublingual' : 'Sublingual', bioavailability: 0.9 },
    { value: 'ophthalmic', label: language === 'pt' ? 'Oftálmico' : 'Ophthalmic', bioavailability: 0.3 }
  ];

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;

      if (data) {
        setPatientName(`${data.first_name} ${data.last_name}`);
        
        // Calculate age in months for pediatric dose calculations
        if (data.date_of_birth) {
          const birthDate = new Date(data.date_of_birth);
          const today = new Date();
          const ageInMonths = 
            (today.getFullYear() - birthDate.getFullYear()) * 12 + 
            (today.getMonth() - birthDate.getMonth());
          setPatientAgeMos(ageInMonths);
        }
      }

      // Fetch weight from vital signs
      const { data: vitalData, error: vitalError } = await supabase
        .from('vital_signs')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: false })
        .limit(1);

      if (vitalError) throw vitalError;

      if (vitalData && vitalData.length > 0 && vitalData[0].weight) {
        setPatientWeight(vitalData[0].weight);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.dosage || !currentItem.frequency) {
      toast({
        title: language === 'pt' ? 'Campos obrigatórios' : 'Required fields',
        description: language === 'pt' 
          ? 'Nome do medicamento, dosagem e frequência são obrigatórios' 
          : 'Medication name, dosage and frequency are required',
        variant: 'destructive'
      });
      return;
    }

    // Perform safety check
    if (currentItem.name) {
      const safetyCheck = performSafetyCheck(currentItem.name);
      
      if (!safetyCheck.hasPassed) {
        setShowSafetyWarning(true);
        // Continue anyway, but show warning
      }
    }

    const newItem: CurrentItem = {
      ...currentItem,
      id: `temp-${Date.now()}`,
      isNew: true
    };

    setItems([...items, newItem]);
    resetCurrentItem();
  };

  const handleUpdateItem = () => {
    if (!currentItem.id) return;

    const updatedItems = items.map(item => 
      item.id === currentItem.id ? { ...item, ...currentItem } : item
    );

    setItems(updatedItems);
    resetCurrentItem();
  };

  const handleEditItem = (item: CurrentItem) => {
    setCurrentItem(item);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const resetCurrentItem = () => {
    setCurrentItem({
      id: '',
      prescription_id: '',
      name: '',
      type: 'medication',
      status: 'pending',
      dosage: '',
      frequency: '',
      duration: '7 days',
      instructions: '',
      details: {}
    });
    setShowSafetyWarning(false);
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast({
        title: language === 'pt' ? 'Nenhum medicamento adicionado' : 'No medications added',
        description: language === 'pt' 
          ? 'Adicione pelo menos um medicamento à prescrição' 
          : 'Add at least one medication to the prescription',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create prescription
      const { data: prescriptionData, error: prescriptionError } = await supabase
        .from('prescriptions')
        .insert({
          patient_id: patientId,
          provider_id: user?.id,
          status: 'active',
          notes: notes || null,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (prescriptionError) throw prescriptionError;
      
      const prescriptionId = prescriptionData.id;
      
      // Insert prescription items
      const prescriptionItems = items.map(item => ({
        prescription_id: prescriptionId,
        name: item.name,
        type: item.type,
        dosage: item.dosage || null,
        frequency: item.frequency || null,
        duration: item.duration || null,
        start_date: new Date().toISOString(),
        end_date: null,
        status: item.status,
        instructions: item.instructions || null,
        details: item.details || null
      }));
      
      const { error: itemsError } = await supabase
        .from('prescription_items')
        .insert(prescriptionItems);
        
      if (itemsError) throw itemsError;
      
      // Success!
      toast({
        title: language === 'pt' ? 'Prescrição criada' : 'Prescription created',
        description: language === 'pt' 
          ? 'Prescrição criada com sucesso' 
          : 'Prescription successfully created',
        variant: 'success'
      });

      // Redirect to patient page
      navigate(`/patients/${patientId}`);
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast({
        title: language === 'pt' ? 'Erro ao criar prescrição' : 'Error creating prescription',
        description: language === 'pt' 
          ? 'Ocorreu um erro ao criar a prescrição' 
          : 'An error occurred while creating the prescription',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRxNormSelect = (medication: any) => {
    setCurrentItem({
      ...currentItem,
      name: medication.name,
      details: {
        ...medication,
        rxcui: medication.rxnormCode,
        portugueseName: medication.portugueseName
      }
    });
    setIsRxNormModalOpen(false);

    // After selecting a medication, check for allergies and interactions
    checkForAllergies(medication.name);
    if (items.length > 0) {
      checkForInteractions([
        ...items.map(item => item.details?.rxcui).filter(Boolean),
        medication.rxnormCode
      ].filter(Boolean));
    }
  };

  const handleMedicationAutocompleteSelect = (medication: any) => {
    setCurrentItem({
      ...currentItem,
      name: medication.name,
      details: {
        ...medication,
        rxcui: medication.rxcui
      }
    });

    // After selecting a medication, check for allergies and interactions
    checkForAllergies(medication.name);
    if (items.length > 0) {
      checkForInteractions([
        ...items.map(item => item.details?.rxcui).filter(Boolean),
        medication.rxcui
      ].filter(Boolean));
    }
  };

  const checkForAllergies = async (medicationName: string) => {
    if (!patientId || !medicationName) return;
    
    setIsAllergyChecking(true);
    try {
      const result = await checkMedicationAllergies(patientId, medicationName);
      setAllergyCheckResult(result);
      
      if (result.length > 0) {
        toast({
          title: language === 'pt' ? 'Alerta de alergia' : 'Allergy Alert',
          description: language === 'pt'
            ? `Possível alergia detectada para ${medicationName}`
            : `Possible allergy detected for ${medicationName}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error checking allergies:', error);
    } finally {
      setIsAllergyChecking(false);
    }
  };

  const checkForInteractions = async (rxcuiList: string[]) => {
    if (!rxcuiList || rxcuiList.length < 2) return;
    
    setIsInteractionChecking(true);
    try {
      const result = await checkDrugInteractions(rxcuiList);
      setInteractionCheckResult(result);
      
      if (result.length > 0) {
        toast({
          title: language === 'pt' ? 'Alerta de interação' : 'Interaction Alert',
          description: language === 'pt'
            ? `${result.length} interações medicamentosas detectadas`
            : `${result.length} drug interactions detected`,
          variant: 'warning'
        });
      }
    } catch (error) {
      console.error('Error checking interactions:', error);
    } finally {
      setIsInteractionChecking(false);
    }
  };

  const calculatePediatricDose = () => {
    if (!patientWeight || !currentItem.details?.rxcui) {
      toast({
        title: language === 'pt' ? 'Dados insuficientes' : 'Insufficient Data',
        description: language === 'pt'
          ? 'Peso do paciente ou informações do medicamento faltando'
          : 'Patient weight or medication information missing',
        variant: 'destructive'
      });
      return;
    }

    // This would be replaced with a call to a medication dosing API or database
    // Here we're using a simple calculation as an example
    const medication = currentItem.name;
    
    // Extract the base dosage from the current medication name
    // This is just a simplified example - in a real app you'd use an API
    let baseDosage = 0;
    let unit = 'mg';
    const doseMatch = medication.match(/(\d+)\s*([a-zA-Z]+)/);
    
    if (doseMatch) {
      baseDosage = parseInt(doseMatch[1]);
      unit = doseMatch[2];
    } else {
      // Default values based on common medications for demo purposes
      if (medication.toLowerCase().includes('amoxicillin')) {
        baseDosage = 50; // 50 mg/kg/day
        unit = 'mg';
      } else if (medication.toLowerCase().includes('ibuprofen')) {
        baseDosage = 10; // 10 mg/kg/dose
        unit = 'mg';
      } else if (medication.toLowerCase().includes('acetaminophen')) {
        baseDosage = 15; // 15 mg/kg/dose
        unit = 'mg';
      } else {
        baseDosage = 5; // Generic example
        unit = 'mg';
      }
    }

    // Calculate dosage
    const calculatedDose = Math.round(baseDosage * patientWeight);
    const selectedFrequency = frequencyOptions.find(f => f.value === currentItem.frequency);
    const timesPerDay = selectedFrequency?.timesPerDay || 1;
    
    const dosePerTime = timesPerDay > 0 ? Math.round(calculatedDose / timesPerDay) : calculatedDose;
    
    // Set calculated dosage
    setCurrentItem({
      ...currentItem,
      dosage: `${dosePerTime} ${unit}`
    });
    
    toast({
      title: language === 'pt' ? 'Dose calculada' : 'Dose Calculated',
      description: `${dosePerTime} ${unit} ${selectedFrequency ? `per dose (${calculatedDose} ${unit}/day)` : ''}`,
      variant: 'success'
    });
    
    setIsDoseCalculatorOpen(false);
  };

  const getSelectedFrequencyLabel = (value: string) => {
    const option = frequencyOptions.find(f => f.value === value);
    return option ? option.label : value;
  };

  const getSelectedRouteLabel = (value: string) => {
    const option = routeOptions.find(r => r.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">
                  {language === 'pt' ? 'Nova Prescrição' : 'New Prescription'}
                </h1>
                <p className="text-muted-foreground">
                  {language === 'pt' ? 'Paciente: ' : 'Patient: '}
                  <span className="font-medium">{patientName}</span>
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Link to={`/patients/${patientId}`}>
                  <Button variant="outline">
                    {language === 'pt' ? 'Cancelar' : 'Cancel'}
                  </Button>
                </Link>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || items.length === 0}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="loading-spinner w-4 h-4"></span>
                      {language === 'pt' ? 'Salvando...' : 'Saving...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {language === 'pt' ? 'Salvar Prescrição' : 'Save Prescription'}
                    </span>
                  )}
                </Button>
              </div>
            </div>
            
            {allergyCheckResult.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {language === 'pt' ? 'Alerta de Alergia' : 'Allergy Alert'}
                </AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    {language === 'pt'
                      ? 'Este paciente tem potenciais alergias a este medicamento:'
                      : 'This patient has potential allergies to this medication:'}
                  </p>
                  <ul className="list-disc pl-5">
                    {allergyCheckResult.map((allergy, index) => (
                      <li key={index}>
                        <strong>{allergy.allergen}</strong>: {allergy.reaction} ({allergy.severity})
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {interactionCheckResult.length > 0 && (
              <Alert variant="warning" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>
                  {language === 'pt' ? 'Interações Medicamentosas' : 'Drug Interactions'}
                </AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    {language === 'pt'
                      ? 'Potenciais interações medicamentosas detectadas:'
                      : 'Potential drug interactions detected:'}
                  </p>
                  <ul className="list-disc pl-5">
                    {interactionCheckResult.map((interaction, index) => (
                      <li key={index}>
                        <strong>{interaction.severity}</strong>: {interaction.description}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'pt' ? 'Adicionar Medicamento' : 'Add Medication'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="medication">
                        {language === 'pt' ? 'Medicamento' : 'Medication'}*
                      </Label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <MedicationAutocomplete
                            initialSearchTerm={currentItem.name}
                            onSelectMedication={handleMedicationAutocompleteSelect}
                            className="w-full"
                          />
                        </div>
                        
                        <Dialog open={isRxNormModalOpen} onOpenChange={setIsRxNormModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" type="button">
                              <Search className="h-4 w-4 mr-1" />
                              {language === 'pt' ? 'RxNorm' : 'RxNorm Search'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {language === 'pt' ? 'Buscar Medicamento RxNorm' : 'RxNorm Medication Search'}
                              </DialogTitle>
                            </DialogHeader>
                            <RxNormMedicationSelector 
                              onMedicationSelect={handleRxNormSelect}
                              initialSearchTerm={currentItem.name}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="dosage">
                          {language === 'pt' ? 'Dosagem' : 'Dosage'}*
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="dosage"
                            value={currentItem.dosage}
                            onChange={(e) => setCurrentItem({...currentItem, dosage: e.target.value})}
                            placeholder="ex: 500mg"
                          />
                          
                          <Dialog open={isDoseCalculatorOpen} onOpenChange={setIsDoseCalculatorOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" type="button">
                                <Calculator className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  {language === 'pt' ? 'Calculadora de Dose Pediátrica' : 'Pediatric Dose Calculator'}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="patient-weight">
                                    {language === 'pt' ? 'Peso do Paciente (kg)' : 'Patient Weight (kg)'}
                                  </Label>
                                  <Input
                                    id="patient-weight"
                                    type="number"
                                    value={patientWeight || ''}
                                    onChange={(e) => setPatientWeight(parseFloat(e.target.value))}
                                  />
                                </div>
                                
                                {patientAgeMos !== null && (
                                  <div className="rounded-md bg-muted p-3">
                                    <p className="text-sm">
                                      {language === 'pt' ? 'Idade do Paciente:' : 'Patient Age:'} {' '}
                                      <strong>
                                        {Math.floor(patientAgeMos / 12)} {language === 'pt' ? 'anos' : 'years'} {patientAgeMos % 12} {language === 'pt' ? 'meses' : 'months'}
                                      </strong>
                                    </p>
                                  </div>
                                )}
                                
                                <div className="space-y-2">
                                  <Label htmlFor="medication-dropdown">
                                    {language === 'pt' ? 'Medicamento' : 'Medication'}
                                  </Label>
                                  <Input
                                    id="medication-dropdown"
                                    value={currentItem.name}
                                    disabled
                                  />
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="frequency-dropdown">
                                    {language === 'pt' ? 'Frequência' : 'Frequency'}
                                  </Label>
                                  <Select
                                    value={currentItem.frequency}
                                    onValueChange={(value) => 
                                      setCurrentItem({...currentItem, frequency: value})
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue 
                                        placeholder={
                                          language === 'pt' 
                                            ? "Selecione a frequência" 
                                            : "Select frequency"
                                        } 
                                      />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {frequencyOptions.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setIsDoseCalculatorOpen(false)}>
                                  {language === 'pt' ? 'Cancelar' : 'Cancel'}
                                </Button>
                                <Button onClick={calculatePediatricDose}>
                                  {language === 'pt' ? 'Calcular Dose' : 'Calculate Dose'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="frequency">
                          {language === 'pt' ? 'Frequência' : 'Frequency'}*
                        </Label>
                        <Select
                          value={currentItem.frequency}
                          onValueChange={(value) => 
                            setCurrentItem({...currentItem, frequency: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue 
                              placeholder={
                                language === 'pt' 
                                  ? "Selecione a frequência" 
                                  : "Select frequency"
                              } 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {frequencyOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="route">
                          {language === 'pt' ? 'Via de Administração' : 'Route'}
                        </Label>
                        <Select
                          value={currentItem.route}
                          onValueChange={(value) => 
                            setCurrentItem({...currentItem, route: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue 
                              placeholder={
                                language === 'pt' 
                                  ? "Selecione a via" 
                                  : "Select route"
                              } 
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {routeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="duration">
                          {language === 'pt' ? 'Duração' : 'Duration'}
                        </Label>
                        <Input
                          id="duration"
                          value={currentItem.duration}
                          onChange={(e) => setCurrentItem({...currentItem, duration: e.target.value})}
                          placeholder="ex: 7 days"
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="instructions">
                          {language === 'pt' ? 'Instruções' : 'Instructions'}
                        </Label>
                        <Input
                          id="instructions"
                          value={currentItem.instructions}
                          onChange={(e) => setCurrentItem({...currentItem, instructions: e.target.value})}
                          placeholder={language === 'pt' ? "Ex: Tomar com alimentos" : "Ex: Take with food"}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Checkbox 
                        id="substitution-allowed"
                        checked={currentItem?.details?.substitutionAllowed}
                        onCheckedChange={(checked) => 
                          setCurrentItem({
                            ...currentItem, 
                            details: {
                              ...currentItem.details,
                              substitutionAllowed: checked === true
                            }
                          })
                        }
                      />
                      <Label htmlFor="substitution-allowed" className="cursor-pointer">
                        {language === 'pt' ? 'Permitir substituição genérica' : 'Allow generic substitution'}
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-3">
                    <Button variant="outline" onClick={resetCurrentItem}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      {language === 'pt' ? 'Limpar' : 'Reset'}
                    </Button>
                    
                    {currentItem.id ? (
                      <Button onClick={handleUpdateItem}>
                        {language === 'pt' ? 'Atualizar Medicamento' : 'Update Medication'}
                      </Button>
                    ) : (
                      <Button onClick={handleAddItem}>
                        <PlusCircle className="h-4 w-4 mr-1" />
                        {language === 'pt' ? 'Adicionar à Prescrição' : 'Add to Prescription'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                
                {showSafetyWarning && (
                  <Alert variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      {language === 'pt' ? 'Aviso de Segurança' : 'Safety Warning'}
                    </AlertTitle>
                    <AlertDescription>
                      {language === 'pt'
                        ? 'Este medicamento pode exigir verificações adicionais. Verifique alergias e interações antes de prosseguir.'
                        : 'This medication may require additional checks. Verify allergies and interactions before proceeding.'}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'pt' ? 'Notas Adicionais' : 'Additional Notes'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={language === 'pt' 
                        ? "Adicione notas sobre esta prescrição..." 
                        : "Add notes about this prescription..."
                      }
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>
                        {language === 'pt' ? 'Itens da Prescrição' : 'Prescription Items'}
                      </span>
                      <Badge variant="outline">
                        {items.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {items.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <Info className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p>
                          {language === 'pt'
                            ? 'Nenhum medicamento adicionado ainda'
                            : 'No medications added yet'
                          }
                        </p>
                        <p className="text-sm mt-1">
                          {language === 'pt'
                            ? 'Adicione medicamentos usando o formulário ao lado'
                            : 'Add medications using the form to the left'
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto px-1">
                        {items.map((item, index) => (
                          <div key={item.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start gap-2">
                              <div className="font-medium line-clamp-1">{item.name}</div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditItem(item)}
                                  className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-muted-foreground hover:text-red-500 p-1 rounded-md hover:bg-muted"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            <Separator className="my-2" />
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-sm">
                              {item.dosage && (
                                <div>
                                  <span className="text-muted-foreground">
                                    {language === 'pt' ? 'Dosagem:' : 'Dosage:'}
                                  </span>{' '}
                                  {item.dosage}
                                </div>
                              )}
                              
                              {item.frequency && (
                                <div>
                                  <span className="text-muted-foreground">
                                    {language === 'pt' ? 'Frequência:' : 'Frequency:'}
                                  </span>{' '}
                                  {getSelectedFrequencyLabel(item.frequency)}
                                </div>
                              )}
                              
                              {item.route && (
                                <div>
                                  <span className="text-muted-foreground">
                                    {language === 'pt' ? 'Via:' : 'Route:'}
                                  </span>{' '}
                                  {getSelectedRouteLabel(item.route)}
                                </div>
                              )}
                              
                              {item.duration && (
                                <div>
                                  <span className="text-muted-foreground">
                                    {language === 'pt' ? 'Duração:' : 'Duration:'}
                                  </span>{' '}
                                  {item.duration}
                                </div>
                              )}
                            </div>
                            
                            {item.instructions && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">
                                  {language === 'pt' ? 'Instruções:' : 'Instructions:'}
                                </span>{' '}
                                {item.instructions}
                              </div>
                            )}
                            
                            {item.details?.rxcui && (
                              <div className="mt-2 flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  RxCUI: {item.details.rxcui}
                                </Badge>
                                
                                {item.details?.substitutionAllowed && (
                                  <Badge variant="outline" className="text-xs">
                                    {language === 'pt' ? 'Genérico permitido' : 'Generic OK'}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PrescribeMedication;
