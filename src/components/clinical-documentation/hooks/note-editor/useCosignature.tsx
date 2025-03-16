
import { toast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { noteService } from '@/services/clinicalNotes/noteService';

export const useCosignature = () => {
  const { language } = useTranslation();

  const requestCosignature = async (noteId: string, cosignerId: string) => {
    if (!noteId) return false;
    
    try {
      const success = await noteService.requestCosignature(noteId, cosignerId);
      
      if (success) {
        toast({
          title: language === 'pt' ? 'Solicitação de coassinatura enviada' : 'Cosignature request sent',
          description: language === 'pt'
            ? 'A solicitação de coassinatura foi enviada com sucesso.'
            : 'The cosignature request has been sent successfully.',
          variant: "success"
        });
        return true;
      } else {
        throw new Error('Failed to request cosignature');
      }
    } catch (error) {
      console.error('Error requesting cosignature:', error);
      toast({
        title: language === 'pt' ? 'Erro ao solicitar coassinatura' : 'Error requesting cosignature',
        description: language === 'pt'
          ? 'Ocorreu um erro ao solicitar a coassinatura. Tente novamente.'
          : 'An error occurred while requesting the cosignature. Please try again.',
        variant: "destructive"
      });
      return false;
    }
  };

  return { requestCosignature };
};
