"use client";

import { useState } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterParams } from "@/lib/types";

interface FilterPanelProps {
  filters: FilterParams;
  availableFilters: {
    makes: string[];
    types: string[];
    conditions: string[];
    slideoutOptions: number[];
  };
  onFilterChange: (key: keyof FilterParams, value: unknown) => void;
  onClearFilters: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

function getSlideoutLabel(value: number): string {
  if (value === 0) return "No Slideouts";
  if (value === 1) return "1 Slideout";
  return `${value} Slideouts`;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900"
      >
        {title}
        <ChevronDown
          className={cn(
            "w-5 h-5 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function FilterPanel({
  filters,
  availableFilters,
  onFilterChange,
  onClearFilters,
  onClose,
  isMobile = false,
}: FilterPanelProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange("search", searchInput || undefined);
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.type || [];
    if (checked) {
      onFilterChange("type", [...currentTypes, type]);
    } else {
      onFilterChange(
        "type",
        currentTypes.filter((t) => t !== type)
      );
    }
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = filters.condition || [];
    if (checked) {
      onFilterChange("condition", [...currentConditions, condition]);
    } else {
      onFilterChange(
        "condition",
        currentConditions.filter((c) => c !== condition)
      );
    }
  };

  const handleMakeChange = (make: string, checked: boolean) => {
    const currentMakes = filters.make || [];
    if (checked) {
      onFilterChange("make", [...currentMakes, make]);
    } else {
      onFilterChange(
        "make",
        currentMakes.filter((m) => m !== make)
      );
    }
  };

  const handleSlideoutChange = (slideout: number, checked: boolean) => {
    const currentSlideouts = filters.slideouts || [];
    if (checked) {
      onFilterChange("slideouts", [...currentSlideouts, slideout]);
    } else {
      onFilterChange(
        "slideouts",
        currentSlideouts.filter((s) => s !== slideout)
      );
    }
  };

  const hasActiveFilters =
    (filters.type && filters.type.length > 0) ||
    (filters.condition && filters.condition.length > 0) ||
    (filters.make && filters.make.length > 0) ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minYear ||
    filters.maxYear ||
    filters.minSleeps ||
    (filters.slideouts && filters.slideouts.length > 0) ||
    filters.search;

  return (
    <div
      className={cn(
        "bg-white",
        isMobile ? "h-full flex flex-col" : "rounded-lg shadow-md"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-heading font-bold text-lg">Filters</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-secondary hover:text-secondary-dark"
            >
              Clear All
            </button>
          )}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div
        className={cn(
          "p-4 overflow-y-auto",
          isMobile ? "flex-1" : "max-h-[calc(100vh-200px)]"
        )}
      >
        {/* Keyword Search */}
        <CollapsibleSection title="Keyword Search">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search stock #, make, model..."
              className="input flex-1 text-sm"
            />
            <button
              type="submit"
              className="btn btn-primary p-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </CollapsibleSection>

        {/* RV Type */}
        {availableFilters.types.length > 0 && (
          <CollapsibleSection title="RV Type">
            <div className="space-y-2">
              {availableFilters.types.map((type: string) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.type?.includes(type) || false}
                    onChange={(e) => handleTypeChange(type, e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Condition */}
        {availableFilters.conditions.length > 0 && (
          <CollapsibleSection title="Condition">
            <div className="space-y-2">
              {availableFilters.conditions.map((condition: string) => (
                <label
                  key={condition}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.condition?.includes(condition) || false}
                    onChange={(e) =>
                      handleConditionChange(condition, e.target.checked)
                    }
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{condition}</span>
                </label>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Make */}
        {availableFilters.makes.length > 0 && (
          <CollapsibleSection title="Make" defaultOpen={false}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.makes.map((make) => (
                <label
                  key={make}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.make?.includes(make) || false}
                    onChange={(e) => handleMakeChange(make, e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{make}</span>
                </label>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Price Range */}
        <CollapsibleSection title="Price Range">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.minPrice || ""}
              onChange={(e) =>
                onFilterChange(
                  "minPrice",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Min"
              className="input text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={filters.maxPrice || ""}
              onChange={(e) =>
                onFilterChange(
                  "maxPrice",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Max"
              className="input text-sm"
            />
          </div>
        </CollapsibleSection>

        {/* Year Range */}
        <CollapsibleSection title="Year">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.minYear || ""}
              onChange={(e) =>
                onFilterChange(
                  "minYear",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Min"
              className="input text-sm"
              min={1990}
              max={2030}
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              value={filters.maxYear || ""}
              onChange={(e) =>
                onFilterChange(
                  "maxYear",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Max"
              className="input text-sm"
              min={1990}
              max={2030}
            />
          </div>
        </CollapsibleSection>

        {/* Sleeping Capacity */}
        <CollapsibleSection title="Sleeping Capacity" defaultOpen={false}>
          <select
            value={filters.minSleeps || ""}
            onChange={(e) =>
              onFilterChange(
                "minSleeps",
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            className="input text-sm"
          >
            <option value="">Any</option>
            <option value="2">2+ People</option>
            <option value="4">4+ People</option>
            <option value="6">6+ People</option>
            <option value="8">8+ People</option>
            <option value="10">10+ People</option>
          </select>
        </CollapsibleSection>

        {/* Slideouts */}
        {availableFilters.slideoutOptions.length > 0 && (
          <CollapsibleSection title="Slideouts" defaultOpen={false}>
            <div className="space-y-2">
              {availableFilters.slideoutOptions.map((slideoutCount: number) => (
                <label
                  key={slideoutCount}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.slideouts?.includes(slideoutCount) || false}
                    onChange={(e) =>
                      handleSlideoutChange(slideoutCount, e.target.checked)
                    }
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{getSlideoutLabel(slideoutCount)}</span>
                </label>
              ))}
            </div>
          </CollapsibleSection>
        )}
      </div>

      {/* Apply Button (Mobile Only) */}
      {isMobile && (
        <div className="p-4 border-t border-gray-200">
          <button onClick={onClose} className="btn btn-primary w-full">
            Show Results
          </button>
        </div>
      )}
    </div>
  );
}
