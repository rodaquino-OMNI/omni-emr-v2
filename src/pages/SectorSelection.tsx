
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import TranslatedText from '@/components/common/TranslatedText';

const SectorCard: React.FC<{ 
  name: string;
  description: string | null;
  onClick: () => void;
  isActive: boolean;
}> = ({ name, description, onClick, isActive }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-lg shadow-md cursor-pointer transition-all
        ${isActive 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-card hover:bg-accent/50 border-border'
        } border`}
    >
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
};

const SectorSelection = () => {
  const navigate = useNavigate();
  const { loading, sectors, selectSector } = useSectorContext();
  const { language } = useTranslation();
  
  const handleSectorSelect = (sector: any) => {
    selectSector(sector);
    navigate('/patients');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-6 container max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            <TranslatedText 
              textKey="selectSector" 
              fallback={language === 'pt' ? 'Selecione um Setor' : 'Select a Sector'} 
            />
          </h1>
          <p className="text-muted-foreground">
            <TranslatedText 
              textKey="selectSectorInstruction" 
              fallback={language === 'pt' 
                ? 'Escolha um setor para visualizar os pacientes' 
                : 'Choose a sector to view patients'
              } 
            />
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : sectors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector) => (
              <SectorCard
                key={sector.id}
                name={sector.name}
                description={sector.description}
                onClick={() => handleSectorSelect(sector)}
                isActive={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/50">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">
              <TranslatedText 
                textKey="noSectorsAvailable" 
                fallback={language === 'pt' ? 'Nenhum setor disponível' : 'No sectors available'} 
              />
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              <TranslatedText 
                textKey="noSectorsMessage" 
                fallback={language === 'pt' 
                  ? 'Você não tem acesso a nenhum setor no momento. Entre em contato com o administrador do sistema.' 
                  : 'You don\'t have access to any sectors at the moment. Please contact your system administrator.'
                } 
              />
            </p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => navigate('/')}
            >
              <TranslatedText 
                textKey="goToHome" 
                fallback={language === 'pt' ? 'Ir para a página inicial' : 'Go to home'} 
              />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SectorSelection;
