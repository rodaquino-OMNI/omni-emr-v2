
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import RecordDetail from '../components/records/RecordDetail';
import { ArrowLeft, Edit, Printer, Trash2, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { recordService } from '@/services/recordService';

const RecordViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!id) return;
    
    setIsDeleting(true);
    try {
      const success = await recordService.deleteRecord(id);
      
      if (success) {
        toast.success(
          language === 'pt' 
            ? 'Registro excluído com sucesso' 
            : 'Record deleted successfully'
        );
        navigate('/records');
      } else {
        throw new Error('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao excluir registro' 
          : 'Error deleting record'
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  if (!id) {
    return <div>Record not found</div>;
  }
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Link to="/records" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  <span>{language === 'pt' ? 'Voltar para registros' : 'Back to records'}</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  {language === 'pt' ? 'Imprimir' : 'Print'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 text-destructive hover:bg-destructive/10"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {language === 'pt' ? 'Excluir' : 'Delete'}
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="h-9"
                  onClick={() => navigate(`/records/${id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {language === 'pt' ? 'Editar' : 'Edit'}
                </Button>
              </div>
            </div>
            
            <RecordDetail recordId={id} />
          </div>
        </main>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'pt' ? 'Excluir Registro' : 'Delete Record'}
            </AlertDialogTitle>
            <AlertDialogDescription className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <span>
                {language === 'pt' 
                  ? 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.' 
                  : 'Are you sure you want to delete this record? This action cannot be undone.'}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {language === 'pt' ? 'Cancelar' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting 
                ? (language === 'pt' ? 'Excluindo...' : 'Deleting...') 
                : (language === 'pt' ? 'Excluir' : 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RecordViewPage;
