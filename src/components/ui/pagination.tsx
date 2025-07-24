import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
  showFirstLast?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className,
  showFirstLast = false,
}: PaginationProps) {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages are less than or equal to max visible pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of the visible page range
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're at the beginning or end
      if (currentPage <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      // Add the visible pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      // Always include the last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          className="hidden sm:flex"
          aria-label="First Page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => 
          page === 'ellipsis-start' || page === 'ellipsis-end' ? (
            <div key={`ellipsis-${index}`} className="flex items-center justify-center w-8 h-8">
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              disabled={isLoading}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || isLoading}
          className="hidden sm:flex"
          aria-label="Last Page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
