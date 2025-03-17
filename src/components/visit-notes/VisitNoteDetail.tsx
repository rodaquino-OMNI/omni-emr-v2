import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Printer, Edit, FileText, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useVisitNote } from '@/hooks/useVisitNote';
import { VitalSignsDisplay } from '@/components/vitals/VitalSignsDisplay';
import { VisitNote, VitalSigns } from '@/types/visitNotes';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

const VisitNoteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const { hasPermission } = usePermissions(user);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null);
  
  const { note, loading, error } = useVisitNote(id);
  
  useEffect(() => {
    // In a real app, we would fetch vital signs from an API
    // This is mock data for demonstration
    if (note) {
      setVitalSigns({
        temperature: 37.2,
        heartRate: 72,
        bloodPressure: '120/80',
        respiratoryRate: 16,
        oxygenSaturation: 98,
        pain: 2,
        timestamp: new Date().toISOString()
      });
    }
  }, [note]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleEdit = () => {
    if (id) {
      navigate(`/visit-notes/edit/${id}`);
    }
  };
  
  const formatNoteDate = (date?: string) => {
    if (!date) return '';
    return format(new Date(date), language === 'pt' ? 'dd/MM/yyyy HH:mm' : 'MMM dd, yyyy h:mm a');
  };
  
  const getStatusColor = (status: VisitNote['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-600">
            {error}
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('goBack')}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!note) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-muted-foreground">
            {t('noteNotFound')}
          </div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('goBack')}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('goBack')}
        </Button>
        
        <div className="flex gap-2">
          {hasPermission('edit_clinical_notes') && (
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              {t('edit')}
            </Button>
          )}
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            {t('print')}
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{note.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatNoteDate(note.created_at)}
              
              {note.provider && (
                <>
                  <span className="mx-1">•</span>
                  <User className="h-4 w-4" />
                  {note.provider.name || note.provider.id}
                </>
              )}
            </div>
          </div>
          
          <Badge className={getStatusColor(note.status)}>
            {note.status === 'in_progress' ? t('inProgress') : t(note.status)}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('patientInformation')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('patientName')}</p>
                <p>{note.patient?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('patientId')}</p>
                <p>{note.patient?.id || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dateOfBirth')}</p>
                <p>{note.patient?.date_of_birth ? format(new Date(note.patient.date_of_birth), 'PP') : 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('gender')}</p>
                <p>{note.patient?.gender || 'Unknown'}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {vitalSigns && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Vital Signs</h3>
              <VitalSignsDisplay data={vitalSigns} />
            </div>
          )}
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-semibold mb-2">{t('visitNoteContent')}</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {note.content ? (
                <div dangerouslySetInnerHTML={{ __html: note.content }} />
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {t('noContentAvailable')}
                </div>
              )}
            </div>
          </div>
          
          {note.diagnosis && note.diagnosis.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('diagnosis')}</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {note.diagnosis.map((diagnosis, index) => (
                    <li key={index}>{diagnosis.code}: {diagnosis.description}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          
          {note.treatment_plan && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('treatmentPlan')}</h3>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: note.treatment_plan }} />
                </div>
              </div>
            </>
          )}
          
          {note.follow_up && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('followUp')}</h3>
                <p>{note.follow_up}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitNoteDetail;
