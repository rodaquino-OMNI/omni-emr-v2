
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent,
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Building } from 'lucide-react';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import TranslatedText from '@/components/common/TranslatedText';
import { toast } from 'sonner';

const SectorSelector = () => {
  const navigate = useNavigate();
  const { sectors, selectedSector, selectSector, isLoading, error, fetchSectors } = useSectorContext();
  const { language } = useTranslation();
  
  // Handle sector change
  const handleSectorChange = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (sector) {
      selectSector(sector);
      toast.success(
        language === 'pt' 
          ? `Setor alterado para ${sector.name}` 
          : `Sector changed to ${sector.name}`
      );
      // Redirect to dashboard after selecting sector
      navigate('/dashboard');
    }
  };
  
  // Refresh sectors list
  const handleRefreshSectors = async () => {
    try {
      await fetchSectors();
      toast.success(
        language === 'pt' 
          ? 'Lista de setores atualizada' 
          : 'Sector list refreshed'
      );
    } catch (error) {
      console.error('Error refreshing sectors:', error);
      toast.error(
        language === 'pt' 
          ? 'Erro ao atualizar setores' 
          : 'Error refreshing sectors'
      );
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          {selectedSector ? (
            <span className="max-w-[150px] truncate">{selectedSector.name}</span>
          ) : (
            <TranslatedText
              textKey="selectSector"
              fallback={language === 'pt' ? 'Selecionar Setor' : 'Select Sector'}
            />
          )}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        <DropdownMenuLabel>
          <TranslatedText
            textKey="availableSectors"
            fallback={language === 'pt' ? 'Setores Disponíveis' : 'Available Sectors'}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <DropdownMenuItem disabled>
            <TranslatedText
              textKey="loading"
              fallback={language === 'pt' ? 'Carregando...' : 'Loading...'}
            />
          </DropdownMenuItem>
        ) : error ? (
          <DropdownMenuItem disabled className="text-red-500">
            <TranslatedText
              textKey="errorLoadingSectors"
              fallback={language === 'pt' ? 'Erro ao carregar setores' : 'Error loading sectors'}
            />
          </DropdownMenuItem>
        ) : sectors.length > 0 ? (
          sectors.map((sector) => (
            <DropdownMenuItem 
              key={sector.id}
              onClick={() => handleSectorChange(sector.id)}
              className="cursor-pointer flex items-center justify-between"
            >
              <span className="truncate">{sector.name}</span>
              {selectedSector?.id === sector.id && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            <TranslatedText
              textKey="noSectorsAvailable"
              fallback={language === 'pt' ? 'Nenhum setor disponível' : 'No sectors available'}
            />
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleRefreshSectors}
          className="cursor-pointer text-xs text-muted-foreground"
        >
          <TranslatedText
            textKey="refreshSectors"
            fallback={language === 'pt' ? 'Atualizar lista' : 'Refresh list'}
          />
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/sectors')}
          className="cursor-pointer"
        >
          <TranslatedText
            textKey="manageSectors"
            fallback={language === 'pt' ? 'Gerenciar Setores' : 'Manage Sectors'}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SectorSelector;
