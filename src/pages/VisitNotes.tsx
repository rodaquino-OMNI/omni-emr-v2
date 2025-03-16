
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
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Clipboard, Plus, Save, Check, Clock, Image, Users } from 'lucide-react';
import { toast } from 'sonner';
import VisitNoteDrawingCanvas from '@/components/visit-notes/VisitNoteDrawingCanvas';
import { useQueryClient } from '@tanstack/react-query';

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
  const [showDrawingDialog, setShowDrawingDialog] = useState(false);
  const [drawings, setDrawings] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [isCollaboratingDialogOpen, setIsCollaboratingDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
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
  
  const handleAddDrawing = (dataUrl: string) => {
    setDrawings([...drawings, dataUrl]);
    setShowDrawingDialog(false);
    toast.success(
      language === 'pt' 
        ? 'Desenho adicionado à nota' 
        : 'Drawing added to note'
    );
  };
  
  const handleRemoveDrawing = (index: number) => {
    const newDrawings = [...drawings];
    newDrawings.splice(index, 1);
    setDrawings(newDrawings);
  };
  
  const handleAddCollaborator = (email: string) => {
    // In a real app, this would send an invitation
    // For this demo, we'll just add them to the list
    if (email && !collaborators.includes(email)) {
      setCollaborators([...collaborators, email]);
      toast.success(
        language === 'pt'
          ? `Convite enviado para ${email}`
          : `Invitation sent to ${email}`
      );
    }
  };
  
  const saveNote = () => {
    // Simulate saving with React Query
    toast.success(
      language === 'pt'
        ? 'Nota salva com sucesso'
        : 'Note saved successfully'
    );
    
    // In a real app, this would be a mutation
    console.log('Saving note:', {
      vitalSigns,
      subjective,
      objective,
      assessmentNote,
      planNote,
      drawings,
      collaborators
    });
    
    // Optimistic UI update example
    queryClient.setQueryData(['visitNotes', 'current'], {
      vitalSigns,
      subjective,
      objective,
      assessmentNote,
      planNote,
      drawings,
      collaborators,
      lastSaved: new Date()
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
                <Dialog open={isCollaboratingDialogOpen} onOpenChange={setIsCollaboratingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {language === 'pt' ? 'Colaboradores' : 'Collaborators'}
                      {collaborators.length > 0 && <span className="ml-1">({collaborators.length})</span>}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <h2 className="text-lg font-semibold mb-4">
                      {language === 'pt' ? 'Adicionar Colaboradores' : 'Add Collaborators'}
                    </h2>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          id="collaborator-email" 
                          placeholder={language === 'pt' ? 'Email do colaborador' : 'Collaborator email'} 
                        />
                        <Button 
                          onClick={() => handleAddCollaborator((document.getElementById('collaborator-email') as HTMLInputElement).value)}
                        >
                          {language === 'pt' ? 'Adicionar' : 'Add'}
                        </Button>
                      </div>
                      
                      {collaborators.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">
                            {language === 'pt' ? 'Colaboradores Atuais' : 'Current Collaborators'}
                          </h3>
                          <ul className="space-y-1">
                            {collaborators.map((email, index) => (
                              <li key={index} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                                {email}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    const newCollaborators = [...collaborators];
                                    newCollaborators.splice(index, 1);
                                    setCollaborators(newCollaborators);
                                  }}
                                >
                                  &times;
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
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
                  {/* Drawing support */}
                  <div className="flex justify-end mb-4">
                    <Dialog open={showDrawingDialog} onOpenChange={setShowDrawingDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Image className="h-4 w-4" />
                          {language === 'pt' ? 'Adicionar Desenho' : 'Add Drawing'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[650px]">
                        <VisitNoteDrawingCanvas onSaveDrawing={handleAddDrawing} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {/* Display added drawings */}
                  {drawings.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {drawings.map((drawing, index) => (
                        <div key={index} className="relative border rounded-md overflow-hidden">
                          <img src={drawing} alt="Clinical drawing" className="w-full h-auto" />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveDrawing(index)}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Collaborators indicator */}
                  {collaborators.length > 0 && (
                    <div className="bg-muted p-2 rounded-md mb-4 flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {language === 'pt' 
                        ? `${collaborators.length} colaboradores podem editar esta nota` 
                        : `${collaborators.length} collaborators can edit this note`}
                    </div>
                  )}
                  
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
