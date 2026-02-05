"use client";

import { InventoryUnit } from "@/lib/types";
import { RVCard } from "./RVCard";

interface InventoryGridProps {
  units: InventoryUnit[];
  isLoading?: boolean;
}

function LoadingSkeleton() {
  return (
    <div className="card animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />

        {/* Subtitle */}
        <div className="h-4 bg-gray-200 rounded w-1/2" />

        {/* Specs */}
        <div className="flex gap-4 pt-2">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>

        {/* Price Section */}
        <div className="pt-4 border-t space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded w-32" />
        </div>

        {/* Button */}
        <div className="h-10 bg-gray-200 rounded w-full mt-4" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full text-center py-16">
      <div className="max-w-md mx-auto">
        <svg
          className="w-24 h-24 mx-auto text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-heading font-bold text-gray-900">
          No RVs Found
        </h3>
        <p className="mt-2 text-gray-500">
          We could not find any RVs matching your criteria. Try adjusting your
          filters or clearing them to see more results.
        </p>
      </div>
    </div>
  );
}

export function InventoryGrid({ units, isLoading = false }: InventoryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="grid grid-cols-1">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {units.map((unit) => (
        <RVCard key={unit.id} unit={unit} />
      ))}
    </div>
  );
}
