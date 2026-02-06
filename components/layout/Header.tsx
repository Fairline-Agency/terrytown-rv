// components/layout/Header.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart, GitCompare } from "lucide-react";
import { TopBar } from "./TopBar";
import { Navigation } from "./Navigation";
import { MobileNav } from "./MobileNav";
import { useFavorites } from "@/context/FavoritesContext";
import { useCompare } from "@/context/CompareContext";

export function Header() {
  const { favorites } = useFavorites();
  const { compareItems } = useCompare();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <TopBar />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/company/branding/logo.png"
              alt="Terry Town RV"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <Navigation />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/inventory"
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link
              href="/compare"
              className="p-2 text-gray-600 hover:text-primary transition-colors relative"
              aria-label="Compare"
            >
              <GitCompare className="w-5 h-5" />
              {compareItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {compareItems.length}
                </span>
              )}
            </Link>
            <Link
              href="/favorites"
              className="p-2 text-gray-600 hover:text-primary transition-colors relative"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
