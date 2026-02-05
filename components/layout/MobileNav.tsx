// components/layout/MobileNav.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronRight, Phone, Heart } from "lucide-react";

const menuItems = [
  { name: "Search RVs", href: "/inventory" },
  { name: "Travel Trailers", href: "/inventory?type=Travel+Trailer", indent: true },
  { name: "Fifth Wheels", href: "/inventory?type=Fifth+Wheel", indent: true },
  { name: "Motorhomes", href: "/inventory?type=Motorhome", indent: true },
  { name: "Toy Haulers", href: "/inventory?type=Toy+Hauler", indent: true },
  { name: "Today's Deals", href: "/inventory?deals=true" },
  { name: "Service", href: "/service" },
  { name: "Parts", href: "/parts" },
  { name: "Financing", href: "/financing" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-700 hover:text-primary"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-heading font-bold text-primary text-lg">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="py-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary ${
                item.indent ? "pl-8 text-sm" : "font-medium"
              }`}
            >
              {item.name}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <a
            href="tel:6166258037"
            className="flex items-center gap-2 text-primary font-medium mb-2"
          >
            <Phone className="w-5 h-5" />
            (616) 625-8037
          </a>
          <Link
            href="/favorites"
            className="flex items-center gap-2 text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <Heart className="w-5 h-5" />
            My Favorites
          </Link>
        </div>
      </div>
    </div>
  );
}
