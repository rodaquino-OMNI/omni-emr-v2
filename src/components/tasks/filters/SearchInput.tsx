
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export interface SearchInputProps {
  value: string;
  onChange: (searchTerm: string) => void;
  customClassName?: string;
  className?: string; // Allow className for backward compatibility
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange,
  customClassName,
  className
}) => {
  const { t } = useTranslation();
  
  // Use either customClassName or className for backward compatibility
  const combinedClassName = customClassName || className;
  
  return (
    <div className={cn(
      "relative w-full md:w-64 lg:w-72", 
      combinedClassName
    )}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      
      <Input
        type="search"
        placeholder={t('searchTasks', 'Search tasks...')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-4 h-10"
      />
    </div>
  );
};

export default SearchInput;
