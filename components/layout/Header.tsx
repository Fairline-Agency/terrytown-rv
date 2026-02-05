// components/layout/Header.tsx

"use client";

import Link from "next/link";
import { Search, Heart, GitCompare } from "lucide-react";
import { TopBar } from "./TopBar";
import { Navigation } from "./Navigation";
import { MobileNav } from "./MobileNav";

export function Header() {
  // Placeholder until context is set up in Task 3.3
  const favorites: number[] = [];
  const compareItems: number[] = [];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <TopBar />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="font-heading font-bold text-2xl text-primary">
              Terry Town RV
            </div>
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
