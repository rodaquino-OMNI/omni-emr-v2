
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

  if (isLoading || sectors.length === 0) {
    return null;
  }

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
      <Select 
        value={selectedSector?.id || ''} 
        onValueChange={handleSectorChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t('selectSector', 'Select sector...')} />
        </SelectTrigger>
        <SelectContent>
          {sectors.map((sector) => (
            <SelectItem key={sector.id} value={sector.id}>
              {sector.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SidebarSectorSelector;
