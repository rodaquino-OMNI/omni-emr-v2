
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TestSelectionListProps {
  tests: string[];
  onRemoveTest: (test: string) => void;
}

const TestSelectionList = ({ tests, onRemoveTest }: TestSelectionListProps) => {
  const { language } = useTranslation();
  
  return (
    <div className="space-y-2">
      <Label>
        {language === 'pt' ? 'Exames Selecionados' : 'Selected Tests'}
      </Label>
      <div className="p-3 border rounded-md min-h-[100px]">
        {tests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tests.map((test, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="flex items-center gap-1 py-1.5 pl-3 pr-2"
              >
                {test}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 rounded-full ml-1"
                  onClick={() => onRemoveTest(test)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {language === 'pt' 
              ? 'Nenhum exame selecionado. Use a busca acima para adicionar exames.' 
              : 'No tests selected. Use the search above to add tests.'
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default TestSelectionList;
