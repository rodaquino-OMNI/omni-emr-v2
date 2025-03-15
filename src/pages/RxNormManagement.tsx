
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RxNormMedicationSelector from '../components/medications/RxNormMedicationSelector';
import RxNormAdminPanel from '../components/medications/RxNormAdminPanel';
import DrugInteractionChecker from '../components/medications/drugInteractions/DrugInteractionChecker';
import MedicationTranslationsAdmin from '../components/admin/MedicationTranslationsAdmin';
import { Database, GitBranch, FileSearch, AlertCircle, Languages } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const RxNormManagementPage = () => {
  const { t, language } = useTranslation();
  const [selectedTab, setSelectedTab] = useState('search');

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Database className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-semibold">
                  {language === 'pt' ? 'Gerenciamento RxNorm' : 'RxNorm Management'}
                </h1>
              </div>
              <p className="text-muted-foreground">
                {language === 'pt' 
                  ? 'Pesquisar, gerenciar e mapear medicamentos entre RxNorm e ANVISA' 
                  : 'Search, manage and map medications between RxNorm and ANVISA'}
              </p>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <FileSearch className="h-4 w-4" />
                  {language === 'pt' ? 'Pesquisar Medicamentos' : 'Search Medications'}
                </TabsTrigger>
                <TabsTrigger value="interactions" className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {language === 'pt' ? 'Interações' : 'Interactions'}
                </TabsTrigger>
                <TabsTrigger value="translations" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  {language === 'pt' ? 'Traduções' : 'Translations'}
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  {language === 'pt' ? 'Administração' : 'Administration'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="search" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'pt' ? 'Pesquisar Medicamentos RxNorm' : 'RxNorm Medication Search'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'pt' 
                        ? 'Pesquise medicamentos pela base de dados RxNorm e visualize detalhes' 
                        : 'Search medications from the RxNorm database and view details'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RxNormMedicationSelector 
                      onMedicationSelect={(med) => {
                        console.log('Selected medication:', med);
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'pt' ? 'Mapeamento ANVISA' : 'ANVISA Mapping'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'pt' 
                        ? 'Mapeie códigos RxNorm para ANVISA ou crie novos mapeamentos' 
                        : 'Map RxNorm codes to ANVISA or create new mappings'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      {language === 'pt' 
                        ? 'Selecione um medicamento para gerenciar mapeamentos' 
                        : 'Select a medication to manage mappings'}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="interactions">
                <DrugInteractionChecker />
              </TabsContent>
              
              <TabsContent value="translations">
                <MedicationTranslationsAdmin />
              </TabsContent>
              
              <TabsContent value="admin">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'pt' ? 'Painel de Administração RxNorm' : 'RxNorm Administration Panel'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'pt' 
                        ? 'Gerencie a sincronização de dados, cache e monitore estatísticas' 
                        : 'Manage data synchronization, caching, and monitor statistics'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RxNormAdminPanel />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RxNormManagementPage;
