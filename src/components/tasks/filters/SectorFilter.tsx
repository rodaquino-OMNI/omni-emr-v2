
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

// Interface for sectors in the hospital
interface Sector {
  id: string;
  name: string;
}

// Mock hospital sectors
const hospitalSectors: Sector[] = [
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'neurology', name: 'Neurology' },
  { id: 'oncology', name: 'Oncology' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'emergency', name: 'Emergency' },
  { id: 'icu', name: 'ICU' },
  { id: 'general', name: 'General' },
];

interface SectorFilterProps {
  value: string;
  onChange: (value: string | undefined) => void;
}

const SectorFilter: React.FC<SectorFilterProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-2">
      <h4 className="font-medium leading-none">{t('sector')}</h4>
      <Select
        value={value || 'all'}
        onValueChange={(value) => onChange(value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All sectors" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All sectors</SelectItem>
            {hospitalSectors.map((sector) => (
              <SelectItem key={sector.id} value={sector.name}>
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
