// context/CompareContext.tsx

"use client";

import { createContext, useContext, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const MAX_COMPARE_ITEMS = 4;

interface CompareContextType {
  compareItems: number[];
  addToCompare: (id: number) => boolean;
  removeFromCompare: (id: number) => void;
  toggleCompare: (id: number) => boolean;
  isInCompare: (id: number) => boolean;
  clearCompare: () => void;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const { value: compareItems, setValue: setCompareItems } = useLocalStorage<
    number[]
  >("terrytownrv-compare", []);

  const canAddMore = compareItems.length < MAX_COMPARE_ITEMS;

  const addToCompare = useCallback(
    (id: number): boolean => {
      if (compareItems.includes(id)) return true;
      if (compareItems.length >= MAX_COMPARE_ITEMS) return false;
      setCompareItems((prev) => [...prev, id]);
      return true;
    },
    [compareItems, setCompareItems]
  );

  const removeFromCompare = useCallback(
    (id: number) => {
      setCompareItems((prev) => prev.filter((item) => item !== id));
    },
    [setCompareItems]
  );

  const toggleCompare = useCallback(
    (id: number): boolean => {
      if (compareItems.includes(id)) {
        removeFromCompare(id);
        return true;
      }
      return addToCompare(id);
    },
    [compareItems, addToCompare, removeFromCompare]
  );

  const isInCompare = useCallback(
    (id: number) => compareItems.includes(id),
    [compareItems]
  );

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, [setCompareItems]);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        canAddMore,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
