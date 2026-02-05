// context/FavoritesContext.tsx

"use client";

import { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface FavoritesContextType {
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { value: favorites, setValue: setFavorites } = useLocalStorage<number[]>(
    "terrytownrv-favorites",
    []
  );

  const addFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) => {
        if (prev.includes(id)) return prev;
        return [...prev, id];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) => prev.filter((fav) => fav !== id));
    },
    [setFavorites]
  );

  const toggleFavorite = useCallback(
    (id: number) => {
      setFavorites((prev) => {
        if (prev.includes(id)) {
          return prev.filter((fav) => fav !== id);
        }
        return [...prev, id];
      });
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (id: number) => favorites.includes(id),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
