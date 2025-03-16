
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import VitalSignsForm from '@/components/visit-notes/VitalSignsForm';
import VitalSignsView from '@/components/visit-notes/VitalSignsView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Clipboard, Plus, Save, Check, Clock } from 'lucide-react';

export interface VitalSigns {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painLevel?: number;
  recordedAt?: string;
  recordedBy?: string;
  notes?: string;
}

const VisitNotes = () => {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState('vitals');
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: 37.0,
    respiratoryRate: 16,
    oxygenSaturation: 98,
    painLevel: 0,
    recordedAt: new Date().toISOString(),
    recordedBy: 'Dr. Smith'
  });
  
  const [assessmentNote, setAssessmentNote] = useState('');
  const [planNote, setPlanNote] = useState('');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  
  const handleVitalSignsSave = (newVitals: VitalSigns) => {
    setVitalSigns(newVitals);
    setShowVitalsForm(false);
  };
  
  const saveNote = () => {
    // In a real app, this would save to the database
    console.log('Saving note:', {
      vitalSigns,
      subjective,
      objective,
      assessmentNote,
      planNote
    });
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
                {language === 'pt' ? 'Notas de Consulta' : 'Visit Notes'}
              </h1>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Clipboard className="h-4 w-4" />
                  {language === 'pt' ? 'Usar Modelo' : 'Use Template'}
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {language === 'pt' ? 'Rascunhos' : 'Drafts'}
                </Button>
                <Button size="sm" className="flex items-center gap-1" onClick={saveNote}>
                  <Save className="h-4 w-4" />
                  {language === 'pt' ? 'Salvar' : 'Save'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="vitals">
                    {language === 'pt' ? 'Sinais Vitais' : 'Vital Signs'}
                  </TabsTrigger>
                  <TabsTrigger value="soap">
                    SOAP
                  </TabsTrigger>
                  <TabsTrigger value="orders">
                    {language === 'pt' ? 'Pedidos' : 'Orders'}
                  </TabsTrigger>
                  <TabsTrigger value="billing">
                    {language === 'pt' ? 'Faturamento' : 'Billing'}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="vitals" className="p-4 border rounded-md mt-4">
                  {showVitalsForm ? (
                    <VitalSignsForm 
                      initialVitals={vitalSigns} 
                      onSubmit={handleVitalSignsSave} 
                      onCancel={() => setShowVitalsForm(false)}
                    />
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-medium">
                          {language === 'pt' ? 'Sinais Vitais' : 'Vital Signs'}
                        </h2>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setShowVitalsForm(true)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          {language === 'pt' ? 'Atualizar' : 'Update'}
                        </Button>
                      </div>
                      <VitalSignsView vitalSigns={vitalSigns} />
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="soap" className="space-y-6 mt-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>
                        {language === 'pt' ? 'Subjetivo' : 'Subjective'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'pt' 
                          ? 'Informações relatadas pelo paciente' 
                          : 'Information reported by the patient'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        className="min-h-[120px]"
                        placeholder={language === 'pt' 
                          ? 'Queixas, histórico, sintomas relatados pelo paciente...' 
                          : 'Complaints, history, symptoms reported by the patient...'}
                        value={subjective}
                        onChange={e => setSubjective(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>
                        {language === 'pt' ? 'Objetivo' : 'Objective'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'pt' 
                          ? 'Achados do exame físico' 
                          : 'Physical examination findings'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        className="min-h-[120px]"
                        placeholder={language === 'pt' 
                          ? 'Observações do exame físico, resultados de exames...' 
                          : 'Physical exam observations, test results...'}
                        value={objective}
                        onChange={e => setObjective(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>
                        {language === 'pt' ? 'Avaliação' : 'Assessment'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'pt' 
                          ? 'Diagnóstico e avaliação clínica' 
                          : 'Diagnosis and clinical assessment'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        className="min-h-[120px]"
                        placeholder={language === 'pt' 
                          ? 'Diagnóstico, impressão clínica...' 
                          : 'Diagnosis, clinical impression...'}
                        value={assessmentNote}
                        onChange={e => setAssessmentNote(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>
                        {language === 'pt' ? 'Plano' : 'Plan'}
                      </CardTitle>
                      <CardDescription>
                        {language === 'pt' 
                          ? 'Plano de tratamento e próximos passos' 
                          : 'Treatment plan and next steps'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        className="min-h-[120px]"
                        placeholder={language === 'pt' 
                          ? 'Plano de tratamento, medicamentos, exames...' 
                          : 'Treatment plan, medications, tests...'}
                        value={planNote}
                        onChange={e => setPlanNote(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders" className="p-4 border rounded-md mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    {language === 'pt' 
                      ? 'Funcionalidade de pedidos em desenvolvimento...' 
                      : 'Orders functionality coming soon...'}
                  </div>
                </TabsContent>
                
                <TabsContent value="billing" className="p-4 border rounded-md mt-4">
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium">
                      {language === 'pt' ? 'Informações de Faturamento' : 'Billing Information'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="visit-type">
                          {language === 'pt' ? 'Tipo de Consulta' : 'Visit Type'}
                        </Label>
                        <Input 
                          id="visit-type" 
                          placeholder={language === 'pt' ? 'Consulta de rotina' : 'Routine visit'} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visit-code">
                          {language === 'pt' ? 'Código de Procedimento' : 'Procedure Code'}
                        </Label>
                        <Input 
                          id="visit-code" 
                          placeholder="99213" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="bill-insurance" />
                        <Label htmlFor="bill-insurance">
                          {language === 'pt' ? 'Faturar ao seguro' : 'Bill to insurance'}
                        </Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitNotes;
