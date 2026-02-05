"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { fetchInventory, fetchAvailableFilters } from "@/lib/api";
import { FilterParams } from "@/lib/types";
import { FilterPanel } from "@/components/inventory/FilterPanel";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { Pagination } from "@/components/inventory/Pagination";
import { cn } from "@/lib/utils";

function parseArrayParam(param: string | null): string[] | undefined {
  if (!param) return undefined;
  return param.split(",").filter(Boolean);
}

function parseNumberArrayParam(param: string | null): number[] | undefined {
  if (!param) return undefined;
  return param
    .split(",")
    .filter(Boolean)
    .map((n) => parseInt(n, 10));
}

function parseNumberParam(param: string | null): number | undefined {
  if (!param) return undefined;
  const num = parseInt(param, 10);
  return isNaN(num) ? undefined : num;
}

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "year-desc", label: "Year: Newest First" },
  { value: "year-asc", label: "Year: Oldest First" },
  { value: "length-asc", label: "Length: Shortest First" },
  { value: "length-desc", label: "Length: Longest First" },
];

function InventoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Parse filters from URL
  const filters: FilterParams = {
    type: parseArrayParam(searchParams.get("type")),
    make: parseArrayParam(searchParams.get("make")),
    condition: parseArrayParam(searchParams.get("condition")),
    minPrice: parseNumberParam(searchParams.get("minPrice")),
    maxPrice: parseNumberParam(searchParams.get("maxPrice")),
    minYear: parseNumberParam(searchParams.get("minYear")),
    maxYear: parseNumberParam(searchParams.get("maxYear")),
    minSleeps: parseNumberParam(searchParams.get("minSleeps")),
    slideouts: parseNumberArrayParam(searchParams.get("slideouts")),
    search: searchParams.get("search") || undefined,
    page: parseNumberParam(searchParams.get("page")) || 1,
    sort: searchParams.get("sort") || undefined,
  };

  // Fetch inventory
  const {
    data: inventoryData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["inventory", filters],
    queryFn: () => fetchInventory(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch available filter options from API
  const { data: availableFilters } = useQuery({
    queryKey: ["availableFilters"],
    queryFn: fetchAvailableFilters,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const filterOptions = {
    makes: availableFilters?.makes || [],
    types: availableFilters?.types || [],
    conditions: availableFilters?.conditions || [],
    slideoutOptions: availableFilters?.slideoutOptions || [],
  };

  // Update URL with new filters
  const updateFilters = useCallback(
    (newFilters: FilterParams) => {
      const params = new URLSearchParams();

      if (newFilters.type && newFilters.type.length > 0) {
        params.set("type", newFilters.type.join(","));
      }
      if (newFilters.make && newFilters.make.length > 0) {
        params.set("make", newFilters.make.join(","));
      }
      if (newFilters.condition && newFilters.condition.length > 0) {
        params.set("condition", newFilters.condition.join(","));
      }
      if (newFilters.minPrice) {
        params.set("minPrice", newFilters.minPrice.toString());
      }
      if (newFilters.maxPrice) {
        params.set("maxPrice", newFilters.maxPrice.toString());
      }
      if (newFilters.minYear) {
        params.set("minYear", newFilters.minYear.toString());
      }
      if (newFilters.maxYear) {
        params.set("maxYear", newFilters.maxYear.toString());
      }
      if (newFilters.minSleeps) {
        params.set("minSleeps", newFilters.minSleeps.toString());
      }
      if (newFilters.slideouts && newFilters.slideouts.length > 0) {
        params.set("slideouts", newFilters.slideouts.join(","));
      }
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }
      if (newFilters.page && newFilters.page > 1) {
        params.set("page", newFilters.page.toString());
      }
      if (newFilters.sort) {
        params.set("sort", newFilters.sort);
      }

      const queryString = params.toString();
      router.push(`/inventory${queryString ? `?${queryString}` : ""}`);
    },
    [router]
  );

  // Handle individual filter changes
  const handleFilterChange = useCallback(
    (key: keyof FilterParams, value: unknown) => {
      const newFilters = { ...filters, [key]: value, page: 1 };
      updateFilters(newFilters);
    },
    [filters, updateFilters]
  );

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    router.push("/inventory");
  }, [router]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      const newFilters = { ...filters, page };
      updateFilters(newFilters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [filters, updateFilters]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (sort: string) => {
      const newFilters = { ...filters, sort: sort || undefined, page: 1 };
      updateFilters(newFilters);
    },
    [filters, updateFilters]
  );

  // Close mobile filter when clicking outside
  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterOpen]);

  const totalResults = inventoryData?.pagination.total || 0;
  const totalPages = inventoryData?.pagination.last_page || 1;
  const currentPage = inventoryData?.pagination.current_page || 1;
  const units = inventoryData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-primary text-white py-8">
        <div className="container">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            RV Inventory
          </h1>
          <p className="mt-2 text-primary-light/80">
            Browse our complete selection of new and used RVs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4">
              <FilterPanel
                filters={filters}
                availableFilters={filterOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-900">
                        {totalResults.toLocaleString()}
                      </span>{" "}
                      {totalResults === 1 ? "RV" : "RVs"} found
                    </>
                  )}
                </div>

                {/* Sort and Filter Controls */}
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={filters.sort || ""}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="input text-sm py-2 pr-8"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden btn btn-outline flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Inventory Grid */}
            <InventoryGrid units={units} isLoading={isLoading || isFetching} />

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer */}
          <div
            className={cn(
              "fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 lg:hidden",
              "transform transition-transform duration-300",
              isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <FilterPanel
              filters={filters}
              availableFilters={filterOptions}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onClose={() => setIsMobileFilterOpen(false)}
              isMobile
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          {/* Page Header Skeleton */}
          <div className="bg-primary text-white py-8">
            <div className="container">
              <div className="h-10 bg-primary-light/30 rounded w-64 animate-pulse" />
              <div className="h-5 bg-primary-light/20 rounded w-96 mt-2 animate-pulse" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="container py-8">
            <div className="flex gap-8">
              {/* Sidebar Skeleton */}
              <aside className="hidden lg:block w-72 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-20 mb-4" />
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i}>
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                        <div className="h-8 bg-gray-100 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content Skeleton */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                    <div className="h-8 bg-gray-200 rounded w-40" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-8 bg-gray-200 rounded w-32 mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
