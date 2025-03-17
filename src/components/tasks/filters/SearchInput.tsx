
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search tasks..." 
}) => {
  const [localValue, setLocalValue] = useState(value);
  
  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);
  
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 h-9"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-9 w-9 p-0"
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
