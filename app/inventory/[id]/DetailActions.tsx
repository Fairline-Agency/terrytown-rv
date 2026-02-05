// app/inventory/[id]/DetailActions.tsx

"use client";

import { Heart, GitCompare } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useCompare } from "@/context/CompareContext";
import { cn } from "@/lib/utils";

interface DetailActionsProps {
  unitId: number;
}

export function DetailActions({ unitId }: DetailActionsProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isInCompare, canAddMore } = useCompare();

  const favorite = isFavorite(unitId);
  const inCompare = isInCompare(unitId);

  const handleFavoriteClick = () => {
    toggleFavorite(unitId);
  };

  const handleCompareClick = () => {
    if (!inCompare && !canAddMore) {
      alert("You can only compare up to 4 units at a time.");
      return;
    }
    toggleCompare(unitId);
  };

  return (
    <div className="flex gap-3">
      {/* Save/Unsave Button */}
      <button
        onClick={handleFavoriteClick}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-medium transition-colors",
          favorite
            ? "border-secondary bg-secondary/10 text-secondary"
            : "border-gray-300 text-gray-700 hover:border-secondary hover:text-secondary"
        )}
      >
        <Heart className={cn("w-5 h-5", favorite && "fill-current")} />
        {favorite ? "Saved" : "Save"}
      </button>

      {/* Compare/Comparing Button */}
      <button
        onClick={handleCompareClick}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 font-medium transition-colors",
          inCompare
            ? "border-primary bg-primary/10 text-primary"
            : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
        )}
      >
        <GitCompare className="w-5 h-5" />
        {inCompare ? "Comparing" : "Compare"}
      </button>
    </div>
  );
}
