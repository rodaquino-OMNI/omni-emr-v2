
import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface TablePaginationProps {
  page: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  setPage: (page: number) => void;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  totalPages,
  startIndex,
  itemsPerPage,
  totalItems,
  setPage
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              className={page === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber;
            
            // First page
            if (i === 0) pageNumber = 1;
            // Last page in our display window
            else if (i === 4) pageNumber = totalPages;
            // Middle pages
            else {
              const middleOffset = Math.min(Math.max(page - 2, 0), totalPages - 5);
              pageNumber = i + 1 + middleOffset;
            }
            
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink 
                  isActive={page === pageNumber}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
              className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TablePagination;
