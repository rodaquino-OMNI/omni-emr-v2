
import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '../hooks/useTranslation';
import FluidIntakeForm from '@/components/fluid-balance/FluidIntakeForm';
import FluidIntakeHistory from '@/components/fluid-balance/FluidIntakeHistory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const FluidBalance = () => {
  const { language } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('intake');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  // For demo purposes, using a fixed patient ID
  // In a real app, this would come from a patient selector or route parameter
  const patientId = "demo-patient-123";
  
  const handleIntakeSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Droplet className="h-6 w-6 text-blue-500" />
              {language === 'pt' ? 'Balanço Hídrico' : 'Fluid Balance'}
            </h1>
            
            <div className="mb-6">
              <Tabs defaultValue="intake" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-[400px]">
                  <TabsTrigger value="intake" className="flex items-center gap-2">
                    <ArrowDownCircle className="h-4 w-4" />
                    {language === 'pt' ? 'Entrada' : 'Intake'}
                  </TabsTrigger>
                  <TabsTrigger value="output" className="flex items-center gap-2">
                    <ArrowUpCircle className="h-4 w-4" />
                    {language === 'pt' ? 'Saída' : 'Output'}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="intake" className="mt-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FluidIntakeForm 
                      patientId={patientId} 
                      onSuccess={handleIntakeSuccess}
                    />
                    <FluidIntakeHistory 
                      patientId={patientId}
                      refreshTrigger={refreshTrigger}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="output" className="mt-6">
                  <div className="p-8 text-center border rounded-lg">
                    <ArrowUpCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'pt' ? 'Registro de Saída de Líquidos' : 'Fluid Output Tracking'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {language === 'pt' 
                        ? 'O módulo de registro de saída de líquidos estará disponível em breve.'
                        : 'The fluid output tracking module will be available soon.'}
                    </p>
                    <Button variant="outline">
                      {language === 'pt' ? 'Notificar quando disponível' : 'Notify when available'}
                    </Button>
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

export default FluidBalance;
