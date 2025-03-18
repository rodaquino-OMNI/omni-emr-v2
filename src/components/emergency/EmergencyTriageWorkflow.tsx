import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import VitalSigns from '@/components/emergency/triage/VitalSigns';
import { AlertTriangle, Clipboard, Activity, BarChart, ClipboardList } from 'lucide-react';

// Mock vital signs data
const mockVitalSigns = {
  heartRate: 88,
  respiratoryRate: 18,
  bloodPressure: '135/85',
  temperature: 37.2,
  painLevel: 7,
  oxygenSaturation: 96
};

interface EmergencyTriageWorkflowProps {
  patientId: string;
  patientName: string;
}

const EmergencyTriageWorkflow: React.FC<EmergencyTriageWorkflowProps> = ({
  patientId,
  patientName
}) => {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState('complaint');
  const [triageLevel, setTriageLevel] = useState<string>('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  
  // In a real app, this would connect to your authentication and permissions system
  const canPerformTriage = true;
  
  const getTriageLevelBadge = (level: string) => {
    switch(level) {
      case 'immediate':
        return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">
          <AlertTriangle className="inline h-3 w-3 mr-1" />
          {language === 'pt' ? 'Imediato' : 'Immediate'}
        </span>;
      case 'emergent':
        return <span className="px-2 py-1 rounded bg-orange-100 text-orange-800 text-xs font-medium">
          {language === 'pt' ? 'Emergente' : 'Emergent'}
        </span>;
      case 'urgent':
        return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">
          {language === 'pt' ? 'Urgente' : 'Urgent'}
        </span>;
      case 'semi-urgent':
        return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
          {language === 'pt' ? 'Semi-urgente' : 'Semi-urgent'}
        </span>;
      case 'non-urgent':
        return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">
          {language === 'pt' ? 'Não urgente' : 'Non-urgent'}
        </span>;
      default:
        return <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium">
          {language === 'pt' ? 'Não classificado' : 'Not triaged'}
        </span>;
    }
  };
  
  const handleUpdateVitals = () => {
    // In a real app, this would show a form to update vitals
    console.log('Update vitals for patient:', patientId);
  };
  
  const handleSaveAssessment = () => {
    // In a real app, this would save the triage assessment
    console.log('Save triage assessment for patient:', patientId);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center mb-1">
        <h3 className="text-lg font-medium">{language === 'pt' ? 'Triagem' : 'Triage'}</h3>
        {triageLevel && getTriageLevelBadge(triageLevel)}
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="complaint" className="flex items-center gap-1">
            <Clipboard className="h-4 w-4" />
            {language === 'pt' ? 'Queixa' : 'Complaint'}
          </TabsTrigger>
          <TabsTrigger value="vitals" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            {language === 'pt' ? 'Sinais vitais' : 'Vitals'}
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            {language === 'pt' ? 'Avaliação' : 'Assessment'}
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex items-center gap-1">
            <ClipboardList className="h-4 w-4" />
            {language === 'pt' ? 'Plano' : 'Plan'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="complaint" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'pt' ? 'Queixa Principal' : 'Chief Complaint'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder={language === 'pt' ? 'Descreva a queixa principal do paciente' : 'Describe the patient\'s chief complaint'}
                className="min-h-[120px]"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
              />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symptom-onset">
                    {language === 'pt' ? 'Início dos Sintomas' : 'Symptom Onset'}
                  </Label>
                  <Input 
                    id="symptom-onset" 
                    type="datetime-local" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="arrival-mode">
                    {language === 'pt' ? 'Modo de Chegada' : 'Arrival Mode'}
                  </Label>
                  <Select>
                    <SelectTrigger id="arrival-mode">
                      <SelectValue placeholder={language === 'pt' ? "Selecione" : "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ambulance">
                        {language === 'pt' ? 'Ambulância' : 'Ambulance'}
                      </SelectItem>
                      <SelectItem value="walk-in">
                        {language === 'pt' ? 'A pé' : 'Walk-in'}
                      </SelectItem>
                      <SelectItem value="wheelchair">
                        {language === 'pt' ? 'Cadeira de rodas' : 'Wheelchair'}
                      </SelectItem>
                      <SelectItem value="stretcher">
                        {language === 'pt' ? 'Maca' : 'Stretcher'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vitals" className="space-y-4 mt-4">
          <VitalSigns 
            vitals={mockVitalSigns}
            patientId={patientId}
            canPerformTriage={true}
            onUpdateVitals={handleUpdateVitals}
          />
        </TabsContent>
        
        <TabsContent value="assessment" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'pt' ? 'Avaliação de Triagem' : 'Triage Assessment'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="triage-level">
                    {language === 'pt' ? 'Nível de Triagem' : 'Triage Level'}
                  </Label>
                  <Select value={triageLevel} onValueChange={setTriageLevel}>
                    <SelectTrigger id="triage-level">
                      <SelectValue placeholder={language === 'pt' ? "Selecione o nível" : "Select level"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">
                        {language === 'pt' ? 'Imediato (Vermelho)' : 'Immediate (Red)'}
                      </SelectItem>
                      <SelectItem value="emergent">
                        {language === 'pt' ? 'Emergente (Laranja)' : 'Emergent (Orange)'}
                      </SelectItem>
                      <SelectItem value="urgent">
                        {language === 'pt' ? 'Urgente (Amarelo)' : 'Urgent (Yellow)'}
                      </SelectItem>
                      <SelectItem value="semi-urgent">
                        {language === 'pt' ? 'Semi-urgente (Verde)' : 'Semi-urgent (Green)'}
                      </SelectItem>
                      <SelectItem value="non-urgent">
                        {language === 'pt' ? 'Não urgente (Azul)' : 'Non-urgent (Blue)'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assessment-notes">
                    {language === 'pt' ? 'Notas de Avaliação' : 'Assessment Notes'}
                  </Label>
                  <Textarea 
                    id="assessment-notes" 
                    placeholder={language === 'pt' 
                      ? 'Observações sobre a condição do paciente' 
                      : 'Observations about the patient\'s condition'}
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button onClick={handleSaveAssessment}>
                  {language === 'pt' ? 'Salvar Avaliação' : 'Save Assessment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="plan" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'pt' ? 'Plano de Cuidados' : 'Care Plan'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">
                    {language === 'pt' ? 'Destino' : 'Destination'}
                  </Label>
                  <Select>
                    <SelectTrigger id="destination">
                      <SelectValue placeholder={language === 'pt' ? "Selecione" : "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="treatment-area">
                        {language === 'pt' ? 'Área de Tratamento' : 'Treatment Area'}
                      </SelectItem>
                      <SelectItem value="imaging">
                        {language === 'pt' ? 'Radiologia' : 'Imaging'}
                      </SelectItem>
                      <SelectItem value="lab">
                        {language === 'pt' ? 'Laboratório' : 'Laboratory'}
                      </SelectItem>
                      <SelectItem value="procedure">
                        {language === 'pt' ? 'Sala de Procedimentos' : 'Procedure Room'}
                      </SelectItem>
                      <SelectItem value="resuscitation">
                        {language === 'pt' ? 'Sala de Ressuscitação' : 'Resuscitation Room'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="doctor">
                    {language === 'pt' ? 'Médico Responsável' : 'Attending Physician'}
                  </Label>
                  <Select>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder={language === 'pt' ? "Selecione" : "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                      <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                      <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="care-notes">
                    {language === 'pt' ? 'Notas do Plano de Cuidados' : 'Care Plan Notes'}
                  </Label>
                  <Textarea 
                    id="care-notes" 
                    placeholder={language === 'pt' 
                      ? 'Instruções e plano de tratamento' 
                      : 'Instructions and treatment plan'}
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button>
                  {language === 'pt' ? 'Salvar Plano' : 'Save Plan'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencyTriageWorkflow;
