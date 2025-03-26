
import React from 'react';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building } from 'lucide-react';

const SidebarSectorSelector: React.FC = () => {
  const { sectors, selectedSector, selectSector, isLoading } = useSectorContext();
  const { t } = useTranslation();

  // Always show the sector selector, even if loading or no sectors
  // This ensures users can see where to select a sector
  const showLoadingState = isLoading;
  const showEmptyState = !isLoading && sectors.length === 0;
  const showSelectorState = !isLoading && sectors.length > 0;
  
  // Highlight the selector if no sector is selected
  const highlightSelector = !selectedSector && showSelectorState;

  const handleSectorChange = (value: string) => {
    const sector = sectors.find(s => s.id === value);
    if (sector) {
      selectSector(sector);
    }
  };

  return (
    <div className="mb-4 px-3 py-2">
      <div className="flex items-center mb-2">
        <Building className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {t('sector', 'Sector')}
        </span>
      </div>
      
      {showLoadingState ? (
        <div className="w-full h-9 bg-muted/30 rounded-md animate-pulse flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            {t('loadingSectors', 'Loading sectors...')}
          </span>
        </div>
      ) : showEmptyState ? (
        <div className="w-full p-2 border border-dashed border-muted-foreground/30 rounded-md">
          <span className="text-xs text-muted-foreground block text-center">
            {t('noSectorsAvailable', 'No sectors available')}
          </span>
        </div>
      ) : (
        <Select
          value={selectedSector?.id || ''}
          onValueChange={handleSectorChange}
        >
          <SelectTrigger
            className={`w-full ${highlightSelector ? 'border-primary border-2 animate-pulse-slow' : ''}`}
          >
            <SelectValue placeholder={t('selectSector', 'Select sector...')} />
            {highlightSelector && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                !
              </span>
            )}
          </SelectTrigger>
          <SelectContent>
            {sectors.map((sector) => (
              <SelectItem key={sector.id} value={sector.id}>
                {sector.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {/* Enhanced help text with more guidance */}
      <div className={`mt-2 text-xs ${!selectedSector ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
        {!selectedSector ? (
          <div className="space-y-1">
            <p className="font-semibold">{t('sectorRequired', 'Sector selection required')}</p>
            <p>{t('sectorHelp', 'Select a sector to access clinical functions')}</p>
            <p>{t('sectorTip', 'This enables patient data and clinical workflows')}</p>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
            <span>{t('sectorSelected', 'Sector selected: ')}<span className="font-medium">{selectedSector.name}</span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarSectorSelector;
