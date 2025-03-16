
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Users, 
  Activity, 
  FileText, 
  Calendar, 
  PlusCircle, 
  Pill, 
  ClipboardList, 
  BeakerIcon, // Replaced Flask with BeakerIcon
  HeartPulse,
  Droplet,
  UserPlus
} from 'lucide-react';
import SectorPatientList from '../patients/SectorPatientList';
import DashboardAlerts from './DashboardAlerts';
import QuickActions from './QuickActions';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RoleDashboard: React.FC = () => {
  const { user } = useAuth();
  const { selectedSector } = useSectorContext();
  const { getRoleDashboard, getRoleDisplayName } = usePermissions(user);
  const { language } = useTranslation();
  
  const dashboardType = getRoleDashboard();
  
  if (!selectedSector) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">
          {language === 'pt' ? 'Por favor, selecione um setor primeiro.' : 'Please select a sector first.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'pt' ? 'Olá, ' : 'Hello, '} 
            {user?.name || getRoleDisplayName()}
          </h1>
          <p className="text-muted-foreground">
            {language === 'pt' ? 'Setor atual: ' : 'Current sector: '}
            <Badge variant="outline" className="ml-1 bg-primary/10">
              {selectedSector.name}
            </Badge>
          </p>
        </div>
      </div>
      
      <DashboardAlerts />
      
      {/* Render different dashboards based on role */}
      {dashboardType === 'physician' && <PhysicianDashboard />}
      {dashboardType === 'nurse' && <NurseDashboard />}
      {dashboardType === 'administrative' && <AdministrativeDashboard />}
      {dashboardType === 'pharmacist' && <PharmacistDashboard />}
      {dashboardType === 'default' && <DefaultDashboard />}
      
      <QuickActions />
    </div>
  );
};

const PhysicianDashboard: React.FC = () => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Painel do Médico' : 'Physician Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Meus Pacientes' : 'My Patients'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Pacientes atribuídos a você' : 'Patients assigned to you'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SectorPatientList 
              className="max-h-96 overflow-y-auto pr-2" 
              limit={5} 
              showViewAll={true} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Documentação Pendente' : 'Pending Documentation'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Notas e documentos para finalizar' : 'Notes and documents to complete'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Nenhuma documentação pendente' : 'No pending documentation'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/clinical-notes/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Nova Nota' : 'New Note'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Resultados Críticos' : 'Critical Results'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Resultados que precisam de atenção' : 'Results requiring attention'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Nenhum resultado crítico pendente' : 'No pending critical results'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="orders">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="orders">
            {language === 'pt' ? 'Ordens' : 'Orders'}
          </TabsTrigger>
          <TabsTrigger value="medications">
            {language === 'pt' ? 'Medicações' : 'Medications'}
          </TabsTrigger>
          <TabsTrigger value="appointments">
            {language === 'pt' ? 'Compromissos' : 'Appointments'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'pt' ? 'Nenhuma ordem pendente' : 'No pending orders'}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/orders/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {language === 'pt' ? 'Nova Ordem' : 'New Order'}
              </Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="medications" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'pt' ? 'Nenhuma medicação para revisar' : 'No medications to review'}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/medications/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {language === 'pt' ? 'Nova Prescrição' : 'New Prescription'}
              </Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="appointments" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'pt' ? 'Nenhum compromisso hoje' : 'No appointments today'}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                {language === 'pt' ? 'Ver Calendário' : 'View Calendar'}
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NurseDashboard: React.FC = () => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Painel de Enfermagem' : 'Nursing Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Pacientes Atribuídos' : 'Assigned Patients'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Seus pacientes atuais' : 'Your current patients'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SectorPatientList 
              className="max-h-96 overflow-y-auto pr-2" 
              limit={5} 
              showViewAll={true} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Pill className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Medicações Pendentes' : 'Pending Medications'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Medicações para administrar' : 'Medications to administer'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Nenhuma medicação pendente' : 'No pending medications'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/medications/administration">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Ver MAR' : 'View MAR'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <HeartPulse className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Sinais Vitais' : 'Vital Signs'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Sinais vitais para documentar' : 'Vital signs to document'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Todos os sinais vitais documentados' : 'All vital signs documented'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/vitals">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Novo Registro' : 'New Entry'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="tasks">
            {language === 'pt' ? 'Tarefas' : 'Tasks'}
          </TabsTrigger>
          <TabsTrigger value="assessments">
            {language === 'pt' ? 'Avaliações' : 'Assessments'}
          </TabsTrigger>
          <TabsTrigger value="fluid-balance">
            {language === 'pt' ? 'Balanço Hídrico' : 'Fluid Balance'}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'pt' ? 'Nenhuma tarefa pendente' : 'No pending tasks'}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="assessments" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'pt' ? 'Nenhuma avaliação pendente' : 'No pending assessments'}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/assessments/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                {language === 'pt' ? 'Nova Avaliação' : 'New Assessment'}
              </Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="fluid-balance" className="bg-muted/30 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-4">
              {language === 'pt' ? 'Nenhum registro pendente' : 'No pending entries'}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/fluid-balance">
                <Droplet className="mr-2 h-4 w-4" />
                {language === 'pt' ? 'Balanço Hídrico' : 'Fluid Balance'}
              </Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AdministrativeDashboard: React.FC = () => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Painel Administrativo' : 'Administrative Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Pacientes no Setor' : 'Sector Patients'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Todos os pacientes neste setor' : 'All patients in this sector'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SectorPatientList 
              className="max-h-96 overflow-y-auto pr-2" 
              limit={5} 
              showViewAll={true} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Compromissos Hoje' : 'Today\'s Appointments'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Agenda do dia' : 'Schedule for today'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Nenhum compromisso hoje' : 'No appointments today'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/appointments/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Agendar' : 'Schedule'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <UserPlus className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Admissões Pendentes' : 'Pending Admissions'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Pacientes para admitir' : 'Patients to admit'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Nenhuma admissão pendente' : 'No pending admissions'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/patients/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Novo Paciente' : 'New Patient'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const PharmacistDashboard: React.FC = () => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        {language === 'pt' ? 'Painel da Farmácia' : 'Pharmacy Dashboard'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Pill className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Prescrições Pendentes' : 'Pending Prescriptions'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Prescrições para verificar' : 'Prescriptions to verify'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Nenhuma prescrição pendente' : 'No pending prescriptions'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <BeakerIcon className="mr-2 h-5 w-5 text-primary" /> {/* Changed from Flask to BeakerIcon */}
              {language === 'pt' ? 'Interações Medicamentosas' : 'Drug Interactions'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Alertas de interação' : 'Interaction alerts'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Nenhuma interação detectada' : 'No interactions detected'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/medications/interactions">
                  <Activity className="mr-2 h-4 w-4" />
                  {language === 'pt' ? 'Verificar Interações' : 'Check Interactions'}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Pacientes no Setor' : 'Sector Patients'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Todos os pacientes neste setor' : 'All patients in this sector'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SectorPatientList 
              className="max-h-96 overflow-y-auto pr-2" 
              limit={5} 
              showViewAll={true} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DefaultDashboard: React.FC = () => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Users className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Pacientes no Setor' : 'Sector Patients'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Todos os pacientes neste setor' : 'All patients in this sector'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SectorPatientList 
              className="max-h-96 overflow-y-auto pr-2" 
              limit={5} 
              showViewAll={true} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg font-medium">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              {language === 'pt' ? 'Atividade Recente' : 'Recent Activity'}
            </CardTitle>
            <CardDescription>
              {language === 'pt' ? 'Eventos e notificações recentes' : 'Recent events and notifications'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                {language === 'pt' ? 'Nenhuma atividade recente' : 'No recent activity'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleDashboard;
