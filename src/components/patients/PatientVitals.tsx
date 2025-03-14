
import React, { useState } from 'react';
import VitalsChart from '../ui/VitalsChart';
import AIInsights from '../ai/AIInsights';
import { useAIInsights } from '@/hooks/useAIInsights';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { PlusCircle, Clock, FileText, Printer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAsync } from '@/hooks/useAsync';
import { toast } from 'sonner';

type PatientVitalsProps = {
  patientId: string;
};

// Mock patient data to use when viewing vitals
const getPatientName = (id: string) => {
  const patients = {
    '1': 'John Doe',
    '2': 'Jane Smith',
    '3': 'Michael Johnson',
    '4': 'Sarah Williams',
  };
  return patients[id as keyof typeof patients] || 'Unknown Patient';
};

const PatientVitals = ({ patientId }: PatientVitalsProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { checkClinicalDocPermission, canManagePatientFluidBalance } = usePermissions(user);
  
  // Get AI insights specifically for vitals
  const { insights } = useAIInsights(patientId, ['vitals']);
  const [activeTab, setActiveTab] = useState('current');
  const [timeRange, setTimeRange] = useState<'24h' | '3d' | '7d'>('24h');
  
  // Mock function for recording vitals - in a real app this would connect to Supabase
  const recordVitals = async () => {
    toast.success(t('vitalSignsRecorded'), {
      description: t('vitalSignsRecordedDescription')
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{getPatientName(patientId)}</h2>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FileText className="h-4 w-4" />
            {t('viewHistory')}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Printer className="h-4 w-4" />
            {t('print')}
          </Button>
          {canManagePatientFluidBalance && (
            <Button size="sm" className="gap-1.5" onClick={recordVitals}>
              <PlusCircle className="h-4 w-4" />
              {t('recordVitals')}
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
          <TabsTrigger value="current">{t('currentVitals')}</TabsTrigger>
          <TabsTrigger value="trends">{t('trends')}</TabsTrigger>
          <TabsTrigger value="insights">{t('insights')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <VitalsChart patientId={patientId} type="heartRate" timeRange="24h" />
            </div>
            <div className="glass-card p-4">
              <VitalsChart patientId={patientId} type="bloodPressure" timeRange="24h" />
            </div>
            <div className="glass-card p-4">
              <VitalsChart patientId={patientId} type="temperature" timeRange="24h" />
            </div>
            <div className="glass-card p-4">
              <VitalsChart patientId={patientId} type="oxygenSaturation" timeRange="24h" />
            </div>
            <div className="glass-card p-4">
              <VitalsChart patientId={patientId} type="respiratoryRate" timeRange="24h" />
            </div>
            <div className="glass-card p-4">
              <VitalsChart patientId={patientId} type="pain" timeRange="24h" />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <div className="mb-4 flex items-center justify-end gap-2">
            <span className="text-sm text-muted-foreground mr-2">{t('timeRange')}:</span>
            <Button 
              variant={timeRange === '24h' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('24h')}
            >
              24h
            </Button>
            <Button 
              variant={timeRange === '3d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('3d')}
            >
              3d
            </Button>
            <Button 
              variant={timeRange === '7d' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setTimeRange('7d')}
            >
              7d
            </Button>
          </div>
          
          <div className="glass-card p-4">
            <VitalsChart patientId={patientId} type="heartRate" timeRange={timeRange} />
          </div>
          <div className="glass-card p-4">
            <VitalsChart patientId={patientId} type="bloodPressure" timeRange={timeRange} />
          </div>
          <div className="glass-card p-4">
            <VitalsChart patientId={patientId} type="temperature" timeRange={timeRange} />
          </div>
          <div className="glass-card p-4">
            <VitalsChart patientId={patientId} type="oxygenSaturation" timeRange={timeRange} />
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          {insights.length > 0 ? (
            <AIInsights 
              insights={insights}
              showSource={false}
            />
          ) : (
            <div className="glass-card p-6 text-center">
              <p className="text-muted-foreground">{t('noInsightsAvailable')}</p>
            </div>
          )}
          
          <div className="glass-card p-4 mt-4">
            <h3 className="text-sm font-medium mb-3">{t('vitalSignsSummary')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm">{t('heartRate')}</span>
                <span className="text-sm font-medium">78 bpm</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm">{t('bloodPressure')}</span>
                <span className="text-sm font-medium">120/80 mmHg</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm">{t('temperature')}</span>
                <span className="text-sm font-medium">37.0 °C</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm">{t('oxygenSaturation')}</span>
                <span className="text-sm font-medium">98%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm">{t('respiratoryRate')}</span>
                <span className="text-sm font-medium">16 {t('breathsPerMinute')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">{t('painLevel')}</span>
                <span className="text-sm font-medium">2/10</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientVitals;
