import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ChevronLeft, Printer, FileEdit, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { Prescription } from '@/types/patient';

const PrescriptionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchPrescription = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('prescriptions')
          .select(`
            *,
            items:prescription_items(*),
            provider:provider_id(id, first_name, last_name, role),
            patient:patient_id(id, first_name, last_name, date_of_birth, mrn)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setPrescription(data as Prescription);
      } catch (err) {
        console.error('Error fetching prescription:', err);
        setError('Failed to load prescription details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescription();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (error || !prescription) {
    return (
      <div className="container mx-auto p-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/prescriptions')}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {language === 'pt' ? 'Voltar para prescrições' : 'Back to prescriptions'}
        </Button>
        
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error || 'Prescription not found'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-300">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/prescriptions')}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {language === 'pt' ? 'Voltar para prescrições' : 'Back to prescriptions'}
      </Button>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {language === 'pt' ? 'Prescrição' : 'Prescription'} #{prescription.id.substring(0, 8)}
        </h1>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Printer className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Imprimir' : 'Print'}
          </Button>
          
          <Button className="flex items-center">
            <FileEdit className="h-4 w-4 mr-2" />
            {language === 'pt' ? 'Editar' : 'Edit'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'pt' ? 'Status' : 'Status'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {getStatusBadge(prescription.status)}
              <span className="ml-2">
                {prescription.status === 'active' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'pt' ? 'Paciente' : 'Patient'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescription.patient && (
              <div>
                <div className="font-medium">
                  {prescription.patient.first_name} {prescription.patient.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  MRN: {prescription.patient.mrn}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {language === 'pt' ? 'Prescritor' : 'Prescriber'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prescription.provider && (
              <div>
                <div className="font-medium">
                  {prescription.provider.first_name} {prescription.provider.last_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {prescription.provider.role}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">
            {language === 'pt' ? 'Detalhes' : 'Details'}
          </TabsTrigger>
          <TabsTrigger value="history">
            {language === 'pt' ? 'Histórico' : 'History'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'pt' ? 'Medicamentos' : 'Medications'}
              </CardTitle>
              <CardDescription>
                {language === 'pt' 
                  ? `Prescrição criada em ${format(new Date(prescription.created_at), 'dd/MM/yyyy')}`
                  : `Prescription created on ${format(new Date(prescription.created_at), 'MMM d, yyyy')}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescription.items && prescription.items.length > 0 ? (
                  prescription.items.map((item) => (
                    <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{item.name}</div>
                        {getStatusBadge(item.status || prescription.status)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {item.dosage && <span>{item.dosage}</span>}
                        {item.frequency && <span> • {item.frequency}</span>}
                        {item.duration && <span> • for {item.duration}</span>}
                      </div>
                      {item.instructions && (
                        <div className="text-sm mt-2 bg-muted p-2 rounded">
                          <span className="font-medium">Instructions: </span>
                          {item.instructions}
                        </div>
                      )}
                      {item.start_date && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Started: {format(new Date(item.start_date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    {language === 'pt' 
                      ? 'Nenhum medicamento nesta prescrição'
                      : 'No medications in this prescription'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'pt' ? 'Histórico de Alterações' : 'Change History'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                {language === 'pt' 
                  ? 'Histórico de alterações não disponível'
                  : 'Change history not available'}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrescriptionView;
