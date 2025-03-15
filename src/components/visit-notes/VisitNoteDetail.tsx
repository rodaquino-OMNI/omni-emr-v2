
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Activity, Calendar, User, Clock, FileText, FilePlus } from 'lucide-react';
import { VisitNote } from '@/services/visitNotes/visitNoteService';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import VitalSignsView from './VitalSignsView';
import VitalSignsForm from './VitalSignsForm';

interface VisitNoteDetailProps {
  note: VisitNote;
  onRefresh?: () => void;
}

const VisitNoteDetail: React.FC<VisitNoteDetailProps> = ({ note, onRefresh }) => {
  console.log("VisitNoteDetail rendering with note:", note);
  
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const { hasPermission } = usePermissions(user);
  const [isVitalSignsDialogOpen, setIsVitalSignsDialogOpen] = useState(false);
  
  // Check if user has permission to record vital signs (doctors and nurses)
  const canRecordVitalSigns = hasPermission('document_vital_signs');
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US');
  };
  
  const handleVitalSignsClose = () => {
    setIsVitalSignsDialogOpen(false);
  };
  
  const handleVitalSignsSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };
  
  if (!note) {
    console.error("VisitNoteDetail: note prop is null or undefined");
    return (
      <Card className="w-full">
        <CardContent className="py-10">
          <p className="text-center text-muted-foreground">
            {language === 'pt' ? 'Nota de visita não encontrada' : 'Visit note not found'}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle>{note.title}</CardTitle>
            <CardDescription>
              <span className="flex items-center gap-1 text-sm mt-1">
                <User className="h-4 w-4" /> 
                {note.patientName}
              </span>
            </CardDescription>
          </div>
          <Badge 
            variant={note.status === 'active' ? 'default' : 'secondary'}
            className="self-start sm:self-auto"
          >
            {note.status === 'active' 
              ? (language === 'pt' ? 'Ativo' : 'Active') 
              : (language === 'pt' ? 'Alta' : 'Discharged')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {language === 'pt' ? 'Data' : 'Date'}: {formatDate(note.date)}
          </div>
          {note.createdBy && (
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {language === 'pt' ? 'Criado por' : 'Created by'}: {note.createdBy}
            </div>
          )}
          {note.updatedAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {language === 'pt' ? 'Atualizado' : 'Updated'}: {formatDate(note.updatedAt)}
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">
            {language === 'pt' ? 'Resumo' : 'Summary'}
          </h3>
          <p className="whitespace-pre-line">{note.summary}</p>
        </div>
        
        {note.vitalSigns ? (
          <div className="border-t pt-4">
            <VitalSignsView vitalSigns={note.vitalSigns} />
          </div>
        ) : canRecordVitalSigns && (
          <div className="border-t pt-4 flex justify-center">
            <div className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground mb-2">
                {language === 'pt' 
                  ? 'Nenhum sinal vital registrado para esta visita.' 
                  : 'No vital signs recorded for this visit.'}
              </p>
              <Dialog open={isVitalSignsDialogOpen} onOpenChange={setIsVitalSignsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FilePlus className="h-4 w-4 mr-2" />
                    {language === 'pt' ? 'Registrar Sinais Vitais' : 'Record Vital Signs'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <VitalSignsForm 
                    visitNoteId={note.id} 
                    patientName={note.patientName}
                    onClose={handleVitalSignsClose}
                    onSuccess={handleVitalSignsSuccess}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
      
      {note.vitalSigns && canRecordVitalSigns && (
        <CardFooter className="flex justify-end border-t pt-4">
          <Dialog open={isVitalSignsDialogOpen} onOpenChange={setIsVitalSignsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                {language === 'pt' ? 'Atualizar Sinais Vitais' : 'Update Vital Signs'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <VitalSignsForm 
                visitNoteId={note.id} 
                patientName={note.patientName}
                onClose={handleVitalSignsClose}
                onSuccess={handleVitalSignsSuccess}
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}
    </Card>
  );
};

export default VisitNoteDetail;
