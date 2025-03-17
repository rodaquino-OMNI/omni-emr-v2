
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building } from 'lucide-react';
import { useSectorContext } from '@/hooks/useSectorContext';

interface SectorFilterProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const SectorFilter: React.FC<SectorFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const { sectors, isLoading } = useSectorContext();
  
  return (
    <div className="space-y-2">
      <h4 className="font-medium leading-none">{t('sector')}</h4>
      <Select
        value={value || 'all'}
        onValueChange={(value) => onChange(value === 'all' ? undefined : value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All sectors" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All sectors</SelectItem>
            {sectors.map((sector) => (
              <SelectItem key={sector.id} value={sector.id}>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{sector.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SectorFilter;
