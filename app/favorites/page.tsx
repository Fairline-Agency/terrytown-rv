"use client";

import Link from "next/link";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "@/context/FavoritesContext";
import { fetchUnitsByIds } from "@/lib/api";
import { RVCard } from "@/components/inventory/RVCard";

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
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-28 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="flex gap-4 mt-3">
                  <div className="h-4 bg-gray-200 rounded w-12" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="pt-4 border-t mt-4">
                  <div className="h-8 bg-gray-200 rounded w-32" />
                </div>
                <div className="h-10 bg-gray-200 rounded mt-4" />
              </div>
            </div>
          ))}
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
            My Favorites
          </h1>
          <p className="mt-2 text-primary-light/80">
            Your saved RVs in one place
          </p>
        </div>
      </div>
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            No Favorites Yet
          </h2>
          <p className="text-gray-600 mb-8">
            Save your favorite RVs by clicking the heart icon on any listing. They will appear here for easy access.
          </p>
          <Link href="/inventory" className="btn btn-primary">
            Browse Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  // Fetch unit data for favorites
  const {
    data: units = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favoriteUnits", favorites],
    queryFn: () => fetchUnitsByIds(favorites),
    enabled: favorites.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  // Show loading state
  if (isLoading && favorites.length > 0) {
    return <LoadingSkeleton />;
  }

  // Show empty state
  if (favorites.length === 0) {
    return <EmptyState />;
  }

  // Sort units to match the order in favorites (most recently added first when reversed)
  const sortedUnits = [...favorites]
    .reverse()
    .map((id) => units.find((u) => u.id === id))
    .filter((u) => u !== undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-primary text-white py-8">
        <div className="container">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">
            My Favorites
          </h1>
          <p className="mt-2 text-primary-light/80">
            {favorites.length} saved RV{favorites.length !== 1 ? "s" : ""}
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
            onClick={clearFavorites}
            className="btn btn-outline text-sm flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedUnits.map((unit) => (
            <RVCard key={unit.id} unit={unit} />
          ))}
        </div>

        {/* Show message if some favorites couldn't be loaded */}
        {sortedUnits.length < favorites.length && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              Some of your favorited RVs may no longer be available. They have been hidden from this view.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
