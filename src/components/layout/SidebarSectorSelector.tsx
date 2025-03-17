
import React from 'react';
import { useSectorContext } from '@/hooks/useSectorContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Building, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SidebarSectorSelector = () => {
  const { sectors, selectedSector, selectSector, isLoading, fetchSectors } = useSectorContext();
  const { t, language } = useTranslation();
  const [refreshing, setRefreshing] = React.useState(false);
  
  const handleSectorChange = (sectorId: string) => {
    const sector = sectors.find(s => s.id === sectorId);
    if (sector) {
      selectSector(sector);
      toast.success(
        language === 'pt' 
          ? `Setor alterado para ${sector.name}` 
          : `Sector changed to ${sector.name}`
      );
    }
  };
  
  const handleRefresh = async () => {
    if (refreshing) return;
    
    setRefreshing(true);
    await fetchSectors();
    
    // Reset refreshing state after a delay
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex justify-between items-center">
        <span>{t('sectors', 'Sectors')}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">{t('refreshSectors', 'Refresh Sectors')}</span>
        </Button>
      </SidebarGroupLabel>
      
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-between">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    <span className="truncate">
                      {selectedSector ? selectedSector.name : t('selectSector', 'Select Sector')}
                    </span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {t('availableSectors', 'Available Sectors')}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {isLoading ? (
                  <DropdownMenuItem disabled>
                    {t('loading', 'Loading...')}
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
                    {t('noSectorsAvailable', 'No sectors available')}
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleRefresh}
                  className="cursor-pointer text-xs text-muted-foreground"
                >
                  {t('refreshSectors', 'Refresh list')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarSectorSelector;
