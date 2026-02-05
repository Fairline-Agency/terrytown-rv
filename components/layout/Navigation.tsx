// components/layout/Navigation.tsx

"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const rvTypes = [
  { name: "Travel Trailers", href: "/inventory?type=Travel+Trailer" },
  { name: "Fifth Wheels", href: "/inventory?type=Fifth+Wheel" },
  { name: "Class A Motorhomes", href: "/inventory?type=Class+A" },
  { name: "Class B Motorhomes", href: "/inventory?type=Class+B" },
  { name: "Class C Motorhomes", href: "/inventory?type=Class+C" },
  { name: "Toy Haulers", href: "/inventory?type=Toy+Hauler" },
];

const navItems = [
  {
    name: "Search RVs",
    href: "/inventory",
    dropdown: rvTypes,
  },
  { name: "Today's Deals", href: "/inventory?deals=true" },
  { name: "Service", href: "/service" },
  { name: "Financing", href: "/financing" },
  { name: "Parts", href: "/parts" },
];

export function Navigation() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {navItems.map((item) => (
        <div
          key={item.name}
          className="relative"
          onMouseEnter={() => item.dropdown && setOpenDropdown(item.name)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          <Link
            href={item.href}
            className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
          >
            {item.name}
            {item.dropdown && <ChevronDown className="w-4 h-4" />}
          </Link>
          {item.dropdown && openDropdown === item.name && (
            <div className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg py-2 min-w-[200px] z-50">
              {item.dropdown.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
