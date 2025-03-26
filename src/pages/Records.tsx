import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { recordService } from '@/services/recordService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MedicalRecord } from '@/types/medicalRecordTypes';

const RecordsPage = () => {
  const { t, language } = useTranslation();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from an API
        const data = await recordService.getAllRecords();
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // Filter records based on search term
  const filteredRecords = records.filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold">
                {language === 'pt' ? 'Registros Médicos' : 'Medical Records'}
              </h1>
              
              <Button asChild>
                <Link to="/records/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'pt' ? 'Novo Registro' : 'New Record'}
                </Link>
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === 'pt' ? 'Buscar registros...' : 'Search records...'}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-4 w-1/3" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredRecords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRecords.map((record) => (
                  <Link to={`/records/${record.id}`} key={record.id} className="block">
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {record.title}
                        </CardTitle>
                        <CardDescription>
                          {language === 'pt' ? 'Paciente ID: ' : 'Patient ID: '}{record.patientId}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <div>
                            {language === 'pt' ? 'Tipo: ' : 'Type: '}{record.type}
                          </div>
                          <div>
                            {language === 'pt' ? 'Status: ' : 'Status: '}{record.status}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="text-xs text-muted-foreground">
                        {language === 'pt' ? 'Data: ' : 'Date: '}
                        {new Date(record.date).toLocaleDateString()}
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'pt' ? 'Nenhum registro encontrado' : 'No records found'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm 
                    ? (language === 'pt' 
                        ? 'Tente ajustar sua busca ou criar um novo registro' 
                        : 'Try adjusting your search or create a new record')
                    : (language === 'pt' 
                        ? 'Comece criando seu primeiro registro médico' 
                        : 'Start by creating your first medical record')}
                </p>
                <Button asChild>
                  <Link to="/records/new">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'pt' ? 'Novo Registro' : 'New Record'}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecordsPage;