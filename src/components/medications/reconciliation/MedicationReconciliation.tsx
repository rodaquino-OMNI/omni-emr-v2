
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  FileCheck, 
  Database, 
  Calendar, 
  Clock,
  Pill
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface MedicationReconciliationProps {
  patientId?: string;
}

interface MedicationHistoryItem {
  id: string;
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  source: 'fhir' | 'legacy' | 'external';
  status: 'active' | 'completed' | 'discontinued' | 'on-hold';
  prescribedBy: string;
  reconciled?: boolean;
  verified?: boolean;
}

const MedicationReconciliation: React.FC<MedicationReconciliationProps> = ({ patientId }) => {
  const { t, language } = useTranslation();
  const [medicationHistory, setMedicationHistory] = useState<MedicationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasExternalData, setHasExternalData] = useState(false);
  
  useEffect(() => {
    const fetchMedicationHistory = async () => {
      if (!patientId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch from medication_requests (FHIR format)
        const { data: fhirData, error: fhirError } = await supabase
          .from('medication_requests')
          .select('id, medication_codeable_concept, dosage_instruction, status, authored_on, requester_id, subject_id')
          .eq('subject_id', patientId);
          
        if (fhirError) throw fhirError;
        
        // Fetch from prescriptions (legacy format)
        const { data: legacyData, error: legacyError } = await supabase
          .from('prescriptions')
          .select('id, patient_id, provider_id, created_at, prescription_items(id, name, dosage, frequency, route, start_date, end_date, status)')
          .eq('patient_id', patientId);
          
        if (legacyError) throw legacyError;
        
        // Transform FHIR data
        const fhirMedications = fhirData?.map(item => {
          const medName = item.medication_codeable_concept?.text || 
            item.medication_codeable_concept?.coding?.[0]?.display || 
            'Unknown Medication';
            
          const dosageText = item.dosage_instruction?.[0]?.text || '';
          
          return {
            id: item.id,
            name: medName,
            dosage: dosageText.split(' ')[0] || '',
            route: dosageText.includes('via') ? dosageText.split('via')[1]?.trim() : '',
            frequency: dosageText.includes('every') ? dosageText.split('every')[1]?.trim() : '',
            startDate: item.authored_on,
            source: 'fhir' as const,
            status: item.status as 'active' | 'completed' | 'discontinued' | 'on-hold',
            prescribedBy: item.requester_id || 'Unknown',
            reconciled: true,
            verified: true
          };
        }) || [];
        
        // Transform legacy data
        const legacyMedications = legacyData?.flatMap(rx => 
          rx.prescription_items
            .filter((item: any) => item.type === 'medication')
            .map((item: any) => ({
              id: item.id,
              name: item.name,
              dosage: item.dosage || '',
              route: item.route || '',
              frequency: item.frequency || '',
              startDate: item.start_date || rx.created_at,
              endDate: item.end_date,
              source: 'legacy' as const,
              status: item.status as 'active' | 'completed' | 'discontinued' | 'on-hold',
              prescribedBy: rx.provider_id || 'Unknown',
              reconciled: false,
              verified: false
            }))
        ) || [];
        
        // Mock external data for demonstration
        const hasExternal = Math.random() > 0.5; // Randomly decide to show external data for demo
        setHasExternalData(hasExternal);
        
        const externalMedications = hasExternal ? [
          {
            id: 'ext-1',
            name: 'Lisinopril',
            dosage: '10mg',
            route: 'Oral',
            frequency: 'Once daily',
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'external' as const,
            status: 'active' as const,
            prescribedBy: 'External Provider',
            reconciled: false,
            verified: false
          },
          {
            id: 'ext-2',
            name: 'Metformin',
            dosage: '500mg',
            route: 'Oral',
            frequency: 'Twice daily',
            startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'external' as const,
            status: 'active' as const,
            prescribedBy: 'External Provider',
            reconciled: false,
            verified: false
          }
        ] : [];
        
        // Combine all data sources
        const allMedications = [...fhirMedications, ...legacyMedications, ...externalMedications];
        
        // Sort by date (most recent first)
        allMedications.sort((a, b) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        
        setMedicationHistory(allMedications);
      } catch (error) {
        console.error('Error fetching medication history:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicationHistory();
  }, [patientId]);
  
  const handleReconcile = (id: string) => {
    setMedicationHistory(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, reconciled: !med.reconciled }
          : med
      )
    );
  };
  
  const handleVerify = (id: string) => {
    setMedicationHistory(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, verified: !med.verified }
          : med
      )
    );
  };
  
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(language === 'pt' ? 'pt-BR' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString || 'Unknown';
    }
  };
  
  const getSourceBadge = (source: 'fhir' | 'legacy' | 'external') => {
    if (source === 'fhir') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <FileCheck className="h-3 w-3 mr-1" />
                FHIR
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{language === 'pt' ? 'Formato FHIR padrão' : 'FHIR standard format'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (source === 'legacy') {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Database className="h-3 w-3 mr-1" />
                {language === 'pt' ? 'Sistema' : 'Legacy'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{language === 'pt' ? 'Formato legado do sistema' : 'Legacy system format'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                <ExternalLink className="h-3 w-3 mr-1" />
                {language === 'pt' ? 'Externo' : 'External'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{language === 'pt' ? 'Dados de sistemas externos' : 'Data from external systems'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!patientId) {
    return (
      <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
        <AlertTitle>
          {language === 'pt' ? 'Paciente não selecionado' : 'No patient selected'}
        </AlertTitle>
        <AlertDescription>
          {language === 'pt' 
            ? 'Selecione um paciente para ver o histórico de medicações'
            : 'Please select a patient to view medication history'}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (medicationHistory.length === 0) {
    return (
      <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-700">
        <AlertTitle>
          {language === 'pt' ? 'Sem histórico de medicações' : 'No medication history'}
        </AlertTitle>
        <AlertDescription>
          {language === 'pt'
            ? 'Este paciente não tem histórico de medicações'
            : 'This patient has no medication history'}
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      {hasExternalData && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {language === 'pt' ? 'Medicações de fontes externas' : 'Medications from external sources'}
          </AlertTitle>
          <AlertDescription>
            {language === 'pt'
              ? 'Existem medicações registradas em sistemas externos que precisam ser reconciliadas'
              : 'There are medications from external systems that need to be reconciled'}
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <div className="flex justify-between mb-4">
          <h3 className="text-base font-medium flex items-center gap-2">
            <Pill className="h-4 w-4" />
            {language === 'pt' ? 'Histórico de Medicações' : 'Medication History'}
            <Badge className="ml-1">{medicationHistory.length}</Badge>
          </h3>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
              {language === 'pt' ? 'Reconciliado' : 'Reconciled'}:
              <Badge variant="outline" className="ml-1 bg-green-50 text-green-700">
                {medicationHistory.filter(m => m.reconciled).length}
              </Badge>
            </span>
            <Separator orientation="vertical" className="h-4 mx-1" />
            <span className="flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
              {language === 'pt' ? 'Não reconciliado' : 'Unreconciled'}:
              <Badge variant="outline" className="ml-1 bg-amber-50 text-amber-700">
                {medicationHistory.filter(m => !m.reconciled).length}
              </Badge>
            </span>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'pt' ? 'Medicação' : 'Medication'}</TableHead>
                <TableHead>{language === 'pt' ? 'Dosagem' : 'Dosage'}</TableHead>
                <TableHead className="hidden md:table-cell">{language === 'pt' ? 'Frequência' : 'Frequency'}</TableHead>
                <TableHead className="hidden md:table-cell">{language === 'pt' ? 'Data' : 'Date'}</TableHead>
                <TableHead>{language === 'pt' ? 'Status' : 'Status'}</TableHead>
                <TableHead>{language === 'pt' ? 'Fonte' : 'Source'}</TableHead>
                <TableHead className="text-right">{language === 'pt' ? 'Ações' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicationHistory.map((medication) => (
                <TableRow key={medication.id} className={!medication.reconciled ? 'bg-amber-50/30' : ''}>
                  <TableCell className="font-medium">
                    {medication.name}
                  </TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell className="hidden md:table-cell">{medication.frequency}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(medication.startDate)}
                      </span>
                      {medication.endDate && (
                        <span className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(medication.endDate)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        medication.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : medication.status === 'discontinued'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : medication.status === 'on-hold'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                      }
                    >
                      {medication.status === 'active' 
                        ? (language === 'pt' ? 'Ativo' : 'Active')
                        : medication.status === 'discontinued'
                          ? (language === 'pt' ? 'Descontinuado' : 'Discontinued')
                          : medication.status === 'on-hold'
                            ? (language === 'pt' ? 'Em espera' : 'On Hold')
                            : (language === 'pt' ? 'Completo' : 'Completed')
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getSourceBadge(medication.source)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant={medication.reconciled ? "default" : "outline"}
                        size="sm"
                        className={`h-8 ${medication.reconciled ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => handleReconcile(medication.id)}
                      >
                        {medication.reconciled ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            {language === 'pt' ? 'Reconciliado' : 'Reconciled'}
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            {language === 'pt' ? 'Reconciliar' : 'Reconcile'}
                          </>
                        )}
                      </Button>
                      {medication.source === 'external' && (
                        <Button
                          variant={medication.verified ? "default" : "outline"}
                          size="sm"
                          className={`h-8 ${medication.verified ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                          onClick={() => handleVerify(medication.id)}
                        >
                          {medication.verified ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                              {language === 'pt' ? 'Verificado' : 'Verified'}
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3.5 w-3.5 mr-1" />
                              {language === 'pt' ? 'Verificar' : 'Verify'}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MedicationReconciliation;
