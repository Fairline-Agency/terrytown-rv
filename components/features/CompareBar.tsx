"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, GitCompare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCompare } from "@/context/CompareContext";
import { fetchUnitsByIds } from "@/lib/api";
import { getImageUrl, cn } from "@/lib/utils";

export function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const [isVisible, setIsVisible] = useState(false);

  // Fetch unit data for compared items
  const { data: units = [] } = useQuery({
    queryKey: ["compareUnits", compareItems],
    queryFn: () => fetchUnitsByIds(compareItems),
    enabled: compareItems.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Show/hide animation
  useEffect(() => {
    if (compareItems.length > 0) {
      // Small delay for mount animation
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [compareItems.length]);

  // Don't render if no items
  if (compareItems.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary shadow-lg z-40",
        "transform transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Icon and thumbnails */}
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-primary flex-shrink-0">
              <GitCompare className="w-5 h-5" />
              <span className="font-semibold text-sm hidden sm:inline">
                Compare ({compareItems.length}/4)
              </span>
              <span className="font-semibold text-sm sm:hidden">
                {compareItems.length}/4
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex items-center gap-2">
              {compareItems.map((id) => {
                const unit = units.find((u) => u.id === id);
                return (
                  <div
                    key={id}
                    className="relative flex-shrink-0 group"
                  >
                    <div className="w-16 h-12 sm:w-20 sm:h-14 relative rounded overflow-hidden border border-gray-200">
                      {unit ? (
                        <Image
                          src={getImageUrl(unit.display_image)}
                          alt={`${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 animate-pulse" />
                      )}
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCompare(id)}
                      className={cn(
                        "absolute -top-2 -right-2 w-5 h-5 rounded-full",
                        "bg-secondary text-white flex items-center justify-center",
                        "hover:bg-secondary-dark transition-colors",
                        "opacity-0 group-hover:opacity-100 sm:opacity-100"
                      )}
                      aria-label="Remove from compare"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {/* Empty slots */}
              {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-16 h-12 sm:w-20 sm:h-14 rounded border-2 border-dashed border-gray-200 flex-shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={clearCompare}
              className="btn btn-outline text-xs sm:text-sm py-2 px-3"
            >
              Clear All
            </button>
            <Link
              href="/compare"
              className={cn(
                "btn btn-primary text-xs sm:text-sm py-2 px-3",
                compareItems.length < 2 && "opacity-50 pointer-events-none"
              )}
            >
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
