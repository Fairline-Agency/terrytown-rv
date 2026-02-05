"use client";

import Image from "next/image";
import Link from "next/link";
import { X, ArrowLeft, GitCompare, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCompare } from "@/context/CompareContext";
import { fetchUnitsByIds } from "@/lib/api";
import { InventoryUnit } from "@/lib/types";
import { formatPrice, formatNumber, getImageUrl, getConditionName, cn } from "@/lib/utils";

interface SpecRowProps {
  label: string;
  units: InventoryUnit[];
  getValue: (unit: InventoryUnit) => string | number | null | undefined;
  format?: (value: string | number | null | undefined) => string;
}

function SpecRow({ label, units, getValue, format }: SpecRowProps) {
  const formatValue = format || ((v) => (v ?? "N/A").toString());

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-4 font-medium text-gray-700 bg-gray-50 whitespace-nowrap">
        {label}
      </td>
      {units.map((unit) => (
        <td key={unit.id} className="py-3 px-4 text-center">
          {formatValue(getValue(unit))}
        </td>
      ))}
    </tr>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-8">
        <div className="container">
          <div className="h-10 bg-primary-light/30 rounded w-64 animate-pulse" />
          <div className="h-5 bg-primary-light/20 rounded w-96 mt-2 animate-pulse" />
        </div>
      </div>
      <div className="container py-8">
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/3] bg-gray-200 rounded" />
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-8">
        <div className="container">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            Compare RVs
          </h1>
          <p className="mt-2 text-primary-light/80">
            Compare specifications side-by-side
          </p>
        </div>
      </div>
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GitCompare className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            No RVs to Compare
          </h2>
          <p className="text-gray-600 mb-8">
            Add RVs to your compare list from the inventory page to see them side by side.
          </p>
          <Link href="/inventory" className="btn btn-primary">
            Browse Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  // Fetch unit data for compared items
  const {
    data: units = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["compareUnits", compareItems],
    queryFn: () => fetchUnitsByIds(compareItems),
    enabled: compareItems.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Show loading state
  if (isLoading && compareItems.length > 0) {
    return <LoadingSkeleton />;
  }

  // Show empty state
  if (compareItems.length === 0) {
    return <EmptyState />;
  }

  // Sort units to match the order in compareItems
  const sortedUnits = compareItems
    .map((id) => units.find((u) => u.id === id))
    .filter((u): u is InventoryUnit => u !== undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-primary text-white py-8">
        <div className="container">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            Compare RVs
          </h1>
          <p className="mt-2 text-primary-light/80">
            Compare {sortedUnits.length} RV{sortedUnits.length !== 1 ? "s" : ""} side by side
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {/* Back link and Clear All */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inventory
          </Link>
          <button
            onClick={clearCompare}
            className="btn btn-outline text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              {/* Header with images */}
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="w-40 p-4 bg-gray-50"></th>
                  {sortedUnits.map((unit) => (
                    <th
                      key={unit.id}
                      className="p-4 min-w-[200px] max-w-[280px]"
                    >
                      <div className="relative">
                        {/* Remove button */}
                        <button
                          onClick={() => removeFromCompare(unit.id)}
                          className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center hover:bg-secondary-dark transition-colors"
                          aria-label="Remove from compare"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        {/* Image */}
                        <Link href={`/inventory/${unit.id}`}>
                          <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100 mb-3">
                            <Image
                              src={getImageUrl(unit.display_image)}
                              alt={`${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                              sizes="280px"
                            />
                          </div>
                        </Link>

                        {/* Title */}
                        <Link href={`/inventory/${unit.id}`}>
                          <h3 className="font-heading font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                            {unit.year} {unit.unit_make?.name} {unit.unit_model?.name}
                          </h3>
                        </Link>
                        {unit.unit_trim?.name && (
                          <p className="text-sm text-gray-500 mt-1">
                            {unit.unit_trim.name}
                          </p>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Spec rows */}
              <tbody>
                <SpecRow
                  label="Price"
                  units={sortedUnits}
                  getValue={(u) => u.price_current}
                  format={(v) => formatPrice(v as number)}
                />
                <SpecRow
                  label="MSRP"
                  units={sortedUnits}
                  getValue={(u) => u.price_msrp}
                  format={(v) => formatPrice(v as number)}
                />
                <SpecRow
                  label="Year"
                  units={sortedUnits}
                  getValue={(u) => u.year}
                />
                <SpecRow
                  label="Condition"
                  units={sortedUnits}
                  getValue={(u) => getConditionName(u.condition)}
                />
                <SpecRow
                  label="Type"
                  units={sortedUnits}
                  getValue={(u) => u.unit_classification?.name}
                />
                <SpecRow
                  label="Length"
                  units={sortedUnits}
                  getValue={(u) => u.vehicle_body_length}
                  format={(v) => (v ? `${Math.round(v as number)} ft` : "N/A")}
                />
                <SpecRow
                  label="Dry Weight"
                  units={sortedUnits}
                  getValue={(u) => u.dry_weight}
                  format={(v) => (v ? `${formatNumber(v as number)} lbs` : "N/A")}
                />
                <SpecRow
                  label="GVWR"
                  units={sortedUnits}
                  getValue={(u) => u.gvwr}
                  format={(v) => (v ? `${formatNumber(v as number)} lbs` : "N/A")}
                />
                <SpecRow
                  label="Sleeps"
                  units={sortedUnits}
                  getValue={(u) => u.max_sleeping_count}
                  format={(v) => (v ? `${v} people` : "N/A")}
                />
                <SpecRow
                  label="Slideouts"
                  units={sortedUnits}
                  getValue={(u) => u.number_of_slideouts}
                  format={(v) => (v !== null && v !== undefined ? v.toString() : "N/A")}
                />
                <SpecRow
                  label="Fresh Water"
                  units={sortedUnits}
                  getValue={(u) => u.total_fresh_water_tank_capacity}
                  format={(v) => (v ? `${formatNumber(v as number)} gal` : "N/A")}
                />
                <SpecRow
                  label="AC BTU"
                  units={sortedUnits}
                  getValue={(u) => u.air_conditioning_btu}
                  format={(v) => (v ? formatNumber(v as number) : "N/A")}
                />
              </tbody>

              {/* Footer with View Details buttons */}
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td className="p-4 bg-gray-50"></td>
                  {sortedUnits.map((unit) => (
                    <td key={unit.id} className="p-4">
                      <Link
                        href={`/inventory/${unit.id}`}
                        className="btn btn-primary w-full"
                      >
                        View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
