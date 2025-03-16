
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  AlertCircle, 
  Edit, 
  Trash2, 
  ArrowLeft,
  PlusCircle,
  Activity,
  Pill,
  Clipboard
} from 'lucide-react';
import VitalSignsForm from '../vital-signs/VitalSignsForm';
import VitalSignsDisplay from '../vital-signs/VitalSignsDisplay';

interface VisitNoteDetailProps {
  id?: string;
}

const VisitNoteDetail: React.FC<VisitNoteDetailProps> = ({ id: propId }) => {
  const { id: paramId } = useParams<{ id: string }>();
  const visitNoteId = propId || paramId;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitNote, setVisitNote] = useState<any | null>(null);
  const [patient, setPatient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [showVitalsForm, setShowVitalsForm] = useState(false);

  useEffect(() => {
    const fetchVisitNote = async () => {
      if (!visitNoteId) return;

      try {
        setLoading(true);
        
        // Fetch the visit note
        const { data, error } = await supabase
          .from('visit_notes')
          .select(`
            *,
            patients:patient_id (id, first_name, last_name, mrn),
            vital_signs:id (*)
          `)
          .eq('id', visitNoteId)
          .single();
          
        if (error) throw error;
        
        if (!data) {
          setError('Visit note not found');
          return;
        }

        setVisitNote(data);
        
        // Get patient data
        if (data.patients) {
          setPatient(data.patients);
        }
      } catch (err: any) {
        console.error('Error fetching visit note:', err);
        setError(err.message || 'Failed to load visit note');
      } finally {
        setLoading(false);
      }
    };

    fetchVisitNote();
  }, [visitNoteId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleVitalsAdded = () => {
    setShowVitalsForm(false);
    // Refetch visit note data to get updated vitals
    // This is a simplified approach; in a real app, you might want to
    // use React Query or similar for better data management
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !visitNote) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Visit note could not be loaded'}
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const formattedDate = new Date(visitNote.visit_date).toLocaleDateString();
  const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            {visitNote.title || 'Visit Note'}
          </h1>
          <p className="text-muted-foreground flex items-center text-sm mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            {formattedDate}
            <Separator orientation="vertical" className="mx-2 h-4" />
            <User className="h-4 w-4 mr-1" />
            {patientName}
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Tag className="h-4 w-4 mr-1" />
            <Badge variant="outline">{visitNote.visit_type}</Badge>
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="details">
            <FileText className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger value="vitals">
            <Activity className="h-4 w-4 mr-2" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="medications">
            <Pill className="h-4 w-4 mr-2" />
            Medications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Clipboard className="h-5 w-5 mr-2 text-primary" />
                Visit Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Chief Complaint</h3>
                <p className="text-muted-foreground bg-muted/50 p-3 rounded-md">
                  {visitNote.chief_complaint || 'No chief complaint recorded'}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Subjective</h3>
                <div className="text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-line">
                  {visitNote.subjective || 'No subjective notes recorded'}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Objective</h3>
                <div className="text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-line">
                  {visitNote.objective || 'No objective notes recorded'}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Assessment</h3>
                <div className="text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-line">
                  {visitNote.assessment || 'No assessment recorded'}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Plan</h3>
                <div className="text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-line">
                  {visitNote.plan || 'No plan recorded'}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vitals" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Vital Signs
            </h2>
            
            <Button onClick={() => setShowVitalsForm(true)} size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Vitals
            </Button>
          </div>
          
          <Sheet open={showVitalsForm} onOpenChange={setShowVitalsForm}>
            <SheetContent className="sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Add Vital Signs</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <VitalSignsForm 
                  patientId={visitNote.patient_id}
                  patientName={patientName}
                  visitNoteId={visitNote.id}
                  onClose={() => setShowVitalsForm(false)}
                  onSuccess={handleVitalsAdded}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          {visitNote.vital_signs && Array.isArray(visitNote.vital_signs) && visitNote.vital_signs.length > 0 ? (
            <Card>
              <CardContent className="pt-6">
                <VitalSignsDisplay vitalSigns={visitNote.vital_signs[0]} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-muted-foreground mb-3">No vital signs recorded for this visit</p>
                <Button onClick={() => setShowVitalsForm(true)} variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Vital Signs
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Pill className="h-5 w-5 mr-2 text-primary" />
                Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-4">
                No medications have been recorded for this visit.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisitNoteDetail;
