
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="relative flex-1">
      <Input
        placeholder={t('search') + '...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pr-8"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
