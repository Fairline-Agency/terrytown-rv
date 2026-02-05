"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;

    // Always show first page
    pages.push(1);

    // Show ellipsis after first page if needed
    if (showEllipsisStart) {
      pages.push("ellipsis");
    }

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    // Add pages around current
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Show ellipsis before last page if needed
    if (showEllipsisEnd) {
      pages.push("ellipsis");
    }

    // Always show last page if more than 1 page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg border transition-colors",
          currentPage === 1
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-gray-400"
              >
                ...
              </span>
            );
          }

          const isCurrentPage = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-10 h-10 rounded-lg font-medium transition-colors",
                isCurrentPage
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label={`Page ${page}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg border transition-colors",
          currentPage === totalPages
            ? "border-gray-200 text-gray-300 cursor-not-allowed"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
