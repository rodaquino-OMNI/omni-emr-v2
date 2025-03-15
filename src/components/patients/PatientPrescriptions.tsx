
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PrescriptionsList } from '../prescriptions';
import { ClipboardList, PlusCircle, Filter, Database, FileText, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type PatientPrescriptionsProps = {
  patientId: string;
  prescriptions: any[];
  loading: boolean;
};

const PatientPrescriptions = ({ patientId, prescriptions, loading }: PatientPrescriptionsProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Get active prescriptions (sample filter logic - adjust as needed)
  const activePrescriptions = prescriptions.filter(p => p.status === 'active');
  
  // Sort prescriptions based on date
  const sortedPrescriptions = [...prescriptions].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt).getTime();
    const dateB = new Date(b.date || b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  // Sort active prescriptions based on date
  const sortedActivePrescriptions = [...activePrescriptions].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt).getTime();
    const dateB = new Date(b.date || b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });
  
  // Count prescriptions by data format
  const fhirCount = prescriptions.filter(p => p.medication_codeable_concept || p.dosage_instruction).length;
  const legacyCount = prescriptions.length - fhirCount;
  
  return (
    <div className="glass-card p-6 border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-medical-purple/10 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-medical-purple" />
          </div>
          <h2 className="text-xl font-medium">{t('prescriptions')}</h2>
          
          {/* Data source indicator */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 ml-2">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-xs flex items-center gap-1 px-2">
                    <ArrowLeftRight className="h-3 w-3 text-blue-600" />
                    <span>Dual Format</span>
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-medium">Enhanced Data Processing</p>
                  <p className="text-sm">This view combines data from both FHIR and legacy formats with automatic format detection and transformation.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-blue-500" />
                      <span>FHIR: {fhirCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Database className="h-3 w-3 text-green-500" />
                      <span>Legacy: {legacyCount}</span>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={sortOrder}
            onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}
          >
            <SelectTrigger className="w-[160px] h-9">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Sort by date" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('newestFirst') || 'Newest first'}</SelectItem>
              <SelectItem value="oldest">{t('oldestFirst') || 'Oldest first'}</SelectItem>
            </SelectContent>
          </Select>
          
          <Link to={`/prescribe/${patientId}`}>
            <Button size="sm" className="flex items-center gap-1 h-9">
              <PlusCircle className="h-4 w-4" />
              {t('newPrescription')}
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
        <TabsList className="mb-4 bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-background">
            {t('allPrescriptions') || 'All Prescriptions'}
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-background">
            {t('activePrescriptions') || 'Active Prescriptions'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-1">
          {loading ? (
            <div className="text-center py-8 animate-pulse">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-muted-foreground">{t('loadingPrescriptions')}...</p>
            </div>
          ) : (
            <PrescriptionsList 
              prescriptions={sortedPrescriptions}
              patientId={patientId}
              showAddNew={false}
            />
          )}
        </TabsContent>
        
        <TabsContent value="active" className="pt-1">
          {loading ? (
            <div className="text-center py-8 animate-pulse">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-muted-foreground">{t('loadingPrescriptions')}...</p>
            </div>
          ) : (
            <PrescriptionsList 
              prescriptions={sortedActivePrescriptions}
              patientId={patientId}
              showAddNew={false}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Data transformation info banner */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-sm">
        <div className="flex items-start">
          <ArrowLeftRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-300">Enhanced Data Compatibility</p>
            <p className="text-blue-700 dark:text-blue-400 mt-1">
              This view automatically normalizes prescriptions from multiple sources with smart format detection.
              It supports both FHIR medication requests and legacy prescription formats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;
