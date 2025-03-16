
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface SectorPatientListPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
}

const SectorPatientListPagination: React.FC<SectorPatientListPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className = '',
}) => {
  const { t } = useTranslation();
  
  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;
  
  const firstItemIndex = (currentPage - 1) * pageSize + 1;
  const lastItemIndex = Math.min(currentPage * pageSize, totalItems);
  
  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center mt-4 ${className}`}>
      <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
        {totalItems === 0 ? (
          t('noPatients', 'No patients found')
        ) : (
          t('showingItems', 'Showing {{first}} to {{last}} of {{total}} patients', {
            first: firstItemIndex,
            last: lastItemIndex,
            total: totalItems
          })
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-2 text-sm text-muted-foreground">
            {t('perPage', 'per page')}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(1)}
            disabled={!canPreviousPage}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm mx-2">
            {t('pageOf', 'Page {{current}} of {{total}}', { 
              current: currentPage, 
              total: totalPages || 1 
            })}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(totalPages)}
            disabled={!canNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SectorPatientListPagination;
