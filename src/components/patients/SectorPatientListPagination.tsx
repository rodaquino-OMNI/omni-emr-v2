
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

const SectorPatientListPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false
}) => {
  const { t, language } = useTranslation();
  
  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }
  
  // Calculate page numbers to display
  // Show up to 5 page numbers centered around the current page
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    
    // If we have fewer than maxPagesToShow pages, show all of them
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate the range to display
    const halfMaxPages = Math.floor(maxPagesToShow / 2);
    const startPage = Math.max(1, currentPage - halfMaxPages);
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust startPage if we're near the end
    const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);
    
    return Array.from(
      { length: endPage - adjustedStartPage + 1 },
      (_, i) => adjustedStartPage + i
    );
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || disabled}
        className="h-8 w-8"
        aria-label={language === 'pt' ? 'Primeira página' : 'First page'}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className="h-8 w-8"
        aria-label={language === 'pt' ? 'Página anterior' : 'Previous page'}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center">
        {pageNumbers.map(page => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            disabled={disabled}
            className="h-8 w-8 mx-0.5 font-medium"
            aria-label={`${language === 'pt' ? 'Página' : 'Page'} ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        className="h-8 w-8"
        aria-label={language === 'pt' ? 'Próxima página' : 'Next page'}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || disabled}
        className="h-8 w-8"
        aria-label={language === 'pt' ? 'Última página' : 'Last page'}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SectorPatientListPagination;
