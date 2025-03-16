
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

export interface SectorPatientListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  onPageSizeChange?: (pageSize: number) => void;
}

const SectorPatientListPagination: React.FC<SectorPatientListPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  onPageSizeChange
}) => {
  const { language } = useTranslation();
  
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always include first page
    pages.push(1);
    
    // Calculate range of pages around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Handle page click
  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };
  
  // If there's only one page, don't render pagination
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={language === 'pt' ? 'Página anterior' : 'Previous page'}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {/* Page number buttons */}
      {getPageNumbers().map((page, index) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <Button key={`ellipsis-${index}`} variant="ghost" size="icon" disabled>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          );
        }
        
        return (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => handlePageClick(Number(page))}
            aria-label={`${language === 'pt' ? 'Página' : 'Page'} ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}
      
      {/* Next page button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={language === 'pt' ? 'Próxima página' : 'Next page'}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SectorPatientListPagination;
