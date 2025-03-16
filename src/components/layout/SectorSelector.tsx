
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
import { Check, ChevronDown } from 'lucide-react';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import TranslatedText from '@/components/common/TranslatedText';

const SectorSelector = () => {
  const navigate = useNavigate();
  const { sectors, selectedSector, selectSector } = useSectorContext();
  const { language } = useTranslation();
  
  // Handle sector change
  const handleSectorChange = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (sector) {
      selectSector(sector);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
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
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <TranslatedText
            textKey="availableSectors"
            fallback={language === 'pt' ? 'Setores Disponíveis' : 'Available Sectors'}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {sectors.length > 0 ? (
          sectors.map((sector) => (
            <DropdownMenuItem 
              key={sector.id}
              onClick={() => handleSectorChange(sector.id)}
              className="cursor-pointer flex items-center justify-between"
            >
              {sector.name}
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
