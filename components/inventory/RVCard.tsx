"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, GitCompare, Ruler, Users, Layers } from "lucide-react";
import { InventoryUnit } from "@/lib/types";
import { formatPrice, calculateSavings, getImageUrl, getConditionName, cn } from "@/lib/utils";
import { useFavorites } from "@/context/FavoritesContext";
import { useCompare } from "@/context/CompareContext";

interface RVCardProps {
  unit: InventoryUnit;
}

export function RVCard({ unit }: RVCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isInCompare, canAddMore } = useCompare();

  const favorite = isFavorite(unit.id);
  const inCompare = isInCompare(unit.id);
  const savings = calculateSavings(unit.price_msrp, unit.price_current);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inCompare && !canAddMore) {
      alert("You can only compare up to 4 units");
      return;
    }
    toggleCompare(unit.id);
  };

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Link href={`/inventory/${unit.id}`}>
          <Image
            src={getImageUrl(unit.display_image)}
            alt={`${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {savings > 0 && (
            <span className="bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
              Save {formatPrice(savings)}
            </span>
          )}
          {unit.condition && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
              {getConditionName(unit.condition)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(unit.id);
            }}
            className={cn(
              "p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors",
              favorite ? "text-secondary" : "text-gray-400 hover:text-secondary"
            )}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
          </button>
          <button
            onClick={handleCompareClick}
            className={cn(
              "p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-colors",
              inCompare ? "text-primary" : "text-gray-400 hover:text-primary"
            )}
            aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          >
            <GitCompare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/inventory/${unit.id}`}>
          <h3 className="font-heading font-bold text-lg text-gray-900 hover:text-primary transition-colors line-clamp-1">
            {unit.year} {unit.unit_make?.name} {unit.unit_model?.name}
          </h3>
        </Link>

        {unit.unit_trim?.name && (
          <p className="text-sm text-gray-500 mt-1">{unit.unit_trim.name}</p>
        )}

        {/* Specs */}
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          {unit.vehicle_body_length && (
            <span className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              {Math.round(unit.vehicle_body_length)}&apos;
            </span>
          )}
          {unit.max_sleeping_count && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Sleeps {unit.max_sleeping_count}
            </span>
          )}
          {unit.number_of_slideouts !== null && unit.number_of_slideouts > 0 && (
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4" />
              {unit.number_of_slideouts} Slides
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-4 pt-4 border-t">
          {savings > 0 && (
            <p className="text-sm text-gray-400 line-through">
              MSRP {formatPrice(unit.price_msrp)}
            </p>
          )}
          <p className="text-2xl font-bold text-primary">
            {formatPrice(unit.price_current)}
          </p>
          {unit.price_monthly && (
            <p className="text-sm text-gray-600">
              Est. {formatPrice(unit.price_monthly)}/mo
            </p>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/inventory/${unit.id}`}
          className="btn btn-primary w-full mt-4"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
