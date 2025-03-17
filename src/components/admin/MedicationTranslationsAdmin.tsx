import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash, 
  Search, 
  RefreshCw, 
  Languages 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Translation {
  id: string;
  rxnorm_code: string;
  english_name: string;
  portuguese_name: string;
  anvisa_code: string | null;
  comments: string | null;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
  last_updated: string;
}

const MedicationTranslationsAdmin: React.FC = () => {
  const { language } = useTranslation();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingTranslation, setProcessingTranslation] = useState<string | null>(null);
  
  const fetchTranslations = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('rxnorm_portuguese_mappings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setTranslations(data || []);
    } catch (error) {
      console.error('Error fetching translations:', error);
      toast.error(
        language === 'pt' ? 'Erro ao carregar traduções' : 'Error loading translations',
        {
          description: error.message,
        }
      );
    } finally {
      setIsLoading(false);
    }
  }, [language]);
  
  useEffect(() => {
    fetchTranslations();
  }, [fetchTranslations]);
  
  const handleVerify = async (id: string) => {
    setProcessingTranslation(id);
    
    try {
      const { error } = await supabase
        .from('rxnorm_portuguese_mappings')
        .update({ 
          is_verified: true,
          last_updated: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setTranslations(translations.map(t => 
        t.id === id ? { ...t, is_verified: true } : t
      ));
      
      toast.success(
        language === 'pt' ? 'Tradução verificada' : 'Translation verified',
        {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />
        }
      );
    } catch (error) {
      console.error('Error verifying translation:', error);
      toast.error(
        language === 'pt' ? 'Erro ao verificar tradução' : 'Error verifying translation',
        {
          description: error.message,
        }
      );
    } finally {
      setProcessingTranslation(null);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm(language === 'pt' 
      ? 'Tem certeza que deseja excluir esta tradução?' 
      : 'Are you sure you want to delete this translation?')) {
      return;
    }
    
    setProcessingTranslation(id);
    
    try {
      const { error } = await supabase
        .from('rxnorm_portuguese_mappings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTranslations(translations.filter(t => t.id !== id));
      
      toast.success(
        language === 'pt' ? 'Tradução excluída' : 'Translation deleted',
        {
          icon: <Trash className="h-5 w-5 text-red-500" />
        }
      );
    } catch (error) {
      console.error('Error deleting translation:', error);
      toast.error(
        language === 'pt' ? 'Erro ao excluir tradução' : 'Error deleting translation',
        {
          description: error.message,
        }
      );
    } finally {
      setProcessingTranslation(null);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredTranslations = translations.filter(t => 
    t.english_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.portuguese_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.rxnorm_code.includes(searchTerm)
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'pt' ? 'pt-BR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              {language === 'pt' 
                ? 'Gerenciamento de Traduções de Medicamentos' 
                : 'Medication Translations Management'}
            </CardTitle>
            <CardDescription>
              {language === 'pt'
                ? 'Revise e aprove traduções de medicamentos RxNorm para Português'
                : 'Review and approve RxNorm medication translations to Portuguese'}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {translations.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder={language === 'pt' ? 'Pesquisar traduções...' : 'Search translations...'}
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button 
            variant="outline" 
            onClick={fetchTranslations} 
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {language === 'pt' ? 'Atualizar' : 'Refresh'}
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTranslations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Languages className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>
              {searchTerm 
                ? (language === 'pt'
                    ? 'Nenhuma tradução encontrada para a pesquisa'
                    : 'No translations found for your search')
                : (language === 'pt'
                    ? 'Nenhuma tradução disponível'
                    : 'No translations available')}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    {language === 'pt' ? 'Nome em Inglês' : 'English Name'}
                  </TableHead>
                  <TableHead className="w-[200px]">
                    {language === 'pt' ? 'Nome em Português' : 'Portuguese Name'}
                  </TableHead>
                  <TableHead>
                    {language === 'pt' ? 'RxNorm/ANVISA' : 'RxNorm/ANVISA'}
                  </TableHead>
                  <TableHead>
                    {language === 'pt' ? 'Data' : 'Date'}
                  </TableHead>
                  <TableHead>
                    {language === 'pt' ? 'Status' : 'Status'}
                  </TableHead>
                  <TableHead className="text-right">
                    {language === 'pt' ? 'Ações' : 'Actions'}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTranslations.map((translation) => (
                  <TableRow key={translation.id}>
                    <TableCell className="font-medium">
                      {translation.english_name}
                    </TableCell>
                    <TableCell>
                      {translation.portuguese_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit">
                          RxNorm: {translation.rxnorm_code}
                        </Badge>
                        {translation.anvisa_code && (
                          <Badge variant="outline" className="w-fit">
                            ANVISA: {translation.anvisa_code}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(translation.created_at)}
                    </TableCell>
                    <TableCell>
                      {translation.is_verified ? (
                        <Badge variant="success">
                          {language === 'pt' ? 'Verificado' : 'Verified'}
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          {language === 'pt' ? 'Pendente' : 'Pending'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!translation.is_verified && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVerify(translation.id)}
                            disabled={processingTranslation === translation.id}
                          >
                            {processingTranslation === translation.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            <span className="sr-only">
                              {language === 'pt' ? 'Verificar' : 'Verify'}
                            </span>
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(translation.id)}
                          disabled={processingTranslation === translation.id}
                        >
                          {processingTranslation === translation.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4 text-destructive" />
                          )}
                          <span className="sr-only">
                            {language === 'pt' ? 'Excluir' : 'Delete'}
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {language === 'pt'
            ? 'As traduções verificadas serão usadas na busca e exibição de medicamentos.'
            : 'Verified translations will be used in medication search and display.'}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MedicationTranslationsAdmin;
