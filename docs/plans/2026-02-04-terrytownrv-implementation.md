# TerryTown RV Website Clone - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an exact visual clone of terrytownrv.com using Next.js 14, powered by the Coast Technology inventory API.

**Architecture:** Next.js App Router with server components for SEO, client components for interactivity. TanStack Query for data fetching/caching. React Context + localStorage for favorites and comparison features. Tailwind CSS for pixel-perfect styling.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, TanStack Query, React Context

---

## Phase 1: Project Setup

### Task 1.1: Initialize Next.js Project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `next.config.js`

**Step 1: Create Next.js app with TypeScript and Tailwind**

```bash
cd "/Users/christianmaher/Documents/TerryTownRV Website"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

Select defaults when prompted. This creates the base Next.js structure.

**Step 2: Install additional dependencies**

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install clsx tailwind-merge
npm install lucide-react
npm install embla-carousel-react
```

**Step 3: Verify installation**

```bash
npm run dev
```

Expected: Server starts at localhost:3000

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 project with dependencies"
```

---

### Task 1.2: Configure Tailwind Theme

**Files:**
- Modify: `tailwind.config.ts`

**Step 1: Update Tailwind config with brand colors**

Replace contents of `tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e3a5f",
          dark: "#152942",
          light: "#2d5a8a",
        },
        secondary: {
          DEFAULT: "#c41230",
          dark: "#a00f28",
          light: "#e6334d",
        },
        accent: {
          DEFAULT: "#f7941d",
          dark: "#d47a0f",
          light: "#ffaa40",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 2: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: configure Tailwind theme with brand colors"
```

---

### Task 1.3: Setup Global Styles and Fonts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Update global styles**

Replace contents of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply antialiased text-gray-800;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }

  .btn-primary {
    @apply bg-primary text-white hover:bg-primary-dark focus:ring-primary;
  }

  .btn-secondary {
    @apply bg-secondary text-white hover:bg-secondary-dark focus:ring-secondary;
  }

  .btn-accent {
    @apply bg-accent text-white hover:bg-accent-dark focus:ring-accent;
  }

  .btn-outline {
    @apply border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary;
  }

  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  }

  .card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }
}
```

**Step 2: Update root layout with fonts**

Replace contents of `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Terry Town RV | World's Largest Indoor RV Showroom",
  description: "Shop the world's largest indoor RV showroom. Browse travel trailers, fifth wheels, motorhomes, and more from top brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**Step 3: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: setup global styles and Google Fonts"
```

---

## Phase 2: API Client and Types

### Task 2.1: Create TypeScript Types

**Files:**
- Create: `lib/types.ts`

**Step 1: Create types file**

```typescript
// lib/types.ts

export interface InventoryUnit {
  id: number;
  stock_number: string;
  vin: string;
  year: number;
  condition: string;
  lot_status: string;

  // Pricing
  price_msrp: number;
  price_current: number;
  price_hidden: number;
  price_monthly: number | null;
  price_biweekly: number | null;
  price_lowest: number | null;
  freight_cost: number | null;

  // Make/Model
  unit_make: {
    id: number;
    name: string;
  };
  unit_model: {
    id: number;
    name: string;
  };
  unit_trim: {
    id: number;
    name: string;
  } | null;
  unit_classification: {
    id: number;
    name: string;
    vehicle_type: {
      id: number;
      name: string;
    };
    vehicle_category: {
      id: number;
      name: string;
    };
  };

  // Specifications
  vehicle_body_length: number | null;
  vehicle_body_height: number | null;
  vehicle_body_width: number | null;
  dry_weight: number | null;
  gvwr: number | null;
  number_of_slideouts: number | null;
  max_sleeping_count: number | null;
  hitch_weight: number | null;

  // Capacities
  total_fresh_water_tank_capacity: number | null;
  total_gray_water_tank_capacity: number | null;
  total_black_water_tank_capacity: number | null;
  fuel_tank_capacity: number | null;
  water_heater_tank_capacity: number | null;

  // Climate
  air_conditioning_btu: number | null;
  heater_btu: number | null;
  awning_length: number | null;

  // Engine (for motorhomes)
  engine: string | null;
  horsepower: number | null;
  torque: number | null;
  fuel_type: string | null;
  chassis_brand: string | null;
  driveline_type: string | null;
  towing_capacity: number | null;

  // Media
  display_image: string | null;
  media: MediaItem[];

  // Descriptions
  inventory_unit_descriptions: UnitDescription[];
  inventory_unit_attributes: UnitAttribute[];
  inventory_unit_options: UnitOption[];

  // Location
  company_location: CompanyLocation;

  // Web
  web_settings: WebSettings | null;
  inventory_website_taglines: Tagline[];

  // URLs
  urls: {
    detail: string;
  } | null;
}

export interface MediaItem {
  id: number;
  url: string;
  type: string;
  order: number;
}

export interface UnitDescription {
  id: number;
  heading: string;
  description: string;
}

export interface UnitAttribute {
  id: number;
  name: string;
  value: string;
}

export interface UnitOption {
  id: number;
  name: string;
  category: string | null;
}

export interface CompanyLocation {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  company: {
    id: number;
    name: string;
  };
}

export interface WebSettings {
  featured: boolean;
  special: boolean;
}

export interface Tagline {
  id: number;
  tagline: string;
}

export interface InventoryResponse {
  ids: number[];
  data: InventoryUnit[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  available_filters: AvailableFilters;
}

export interface AvailableFilters {
  year: { min: number; max: number };
  price_current: { min: number; max: number };
  price_msrp: { min: number; max: number };
  vehicle_body_length: { min: number; max: number };
  dry_weight: { min: number; max: number };
  gvwr: { min: number; max: number };
  max_sleeping_count: { min: number; max: number };
  number_of_slideouts: { min: number; max: number };
}

export interface FilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string[];
  make?: string[];
  model?: string[];
  condition?: string[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minSleeps?: number;
  maxSleeps?: number;
  minWeight?: number;
  maxWeight?: number;
  slideouts?: number[];
  features?: string[];
  sort?: string;
}
```

**Step 2: Commit**

```bash
mkdir -p lib
git add lib/types.ts
git commit -m "feat: add TypeScript types for inventory API"
```

---

### Task 2.2: Create API Client

**Files:**
- Create: `lib/api.ts`

**Step 1: Create API client**

```typescript
// lib/api.ts

import { InventoryResponse, InventoryUnit, FilterParams } from "./types";

const BASE_URL = "https://inventory.coasttechnology.org/api/v3";
const COMPANY_ID = 43;

function buildFilterString(params: FilterParams): string {
  const filters: string[] = [];
  let filterIndex = 0;

  // Always include displayOnWebsite filter
  filters.push(
    `filters[$and][${filterIndex}][displayOnWebsite][$eq]=true`
  );
  filterIndex++;

  // Search/keyword filter
  if (params.search) {
    filters.push(
      `filters[$and][${filterIndex}][$or][0][stock_number][$containsi]=${encodeURIComponent(params.search)}`
    );
    filters.push(
      `filters[$and][${filterIndex}][$or][1][unit_make][name][$containsi]=${encodeURIComponent(params.search)}`
    );
    filters.push(
      `filters[$and][${filterIndex}][$or][2][unit_model][name][$containsi]=${encodeURIComponent(params.search)}`
    );
    filterIndex++;
  }

  // Type filter (classification name)
  if (params.type && params.type.length > 0) {
    params.type.forEach((t, i) => {
      filters.push(
        `filters[$and][${filterIndex}][$or][${i}][unit_classification][name][$eqi]=${encodeURIComponent(t)}`
      );
    });
    filterIndex++;
  }

  // Make filter
  if (params.make && params.make.length > 0) {
    params.make.forEach((m, i) => {
      filters.push(
        `filters[$and][${filterIndex}][$or][${i}][unit_make][name][$eqi]=${encodeURIComponent(m)}`
      );
    });
    filterIndex++;
  }

  // Condition filter
  if (params.condition && params.condition.length > 0) {
    params.condition.forEach((c, i) => {
      filters.push(
        `filters[$and][${filterIndex}][$or][${i}][condition][$eqi]=${encodeURIComponent(c)}`
      );
    });
    filterIndex++;
  }

  // Price range
  if (params.minPrice) {
    filters.push(
      `filters[$and][${filterIndex}][price_current][$gte]=${params.minPrice}`
    );
    filterIndex++;
  }
  if (params.maxPrice) {
    filters.push(
      `filters[$and][${filterIndex}][price_current][$lte]=${params.maxPrice}`
    );
    filterIndex++;
  }

  // Year range
  if (params.minYear) {
    filters.push(
      `filters[$and][${filterIndex}][year][$gte]=${params.minYear}`
    );
    filterIndex++;
  }
  if (params.maxYear) {
    filters.push(
      `filters[$and][${filterIndex}][year][$lte]=${params.maxYear}`
    );
    filterIndex++;
  }

  // Sleeping capacity
  if (params.minSleeps) {
    filters.push(
      `filters[$and][${filterIndex}][max_sleeping_count][$gte]=${params.minSleeps}`
    );
    filterIndex++;
  }

  // Weight
  if (params.maxWeight) {
    filters.push(
      `filters[$and][${filterIndex}][gvwr][$lte]=${params.maxWeight}`
    );
    filterIndex++;
  }

  // Slideouts
  if (params.slideouts && params.slideouts.length > 0) {
    params.slideouts.forEach((s, i) => {
      filters.push(
        `filters[$and][${filterIndex}][$or][${i}][number_of_slideouts][$eq]=${s}`
      );
    });
    filterIndex++;
  }

  return filters.join("&");
}

function buildSortString(sort?: string): string {
  switch (sort) {
    case "price-asc":
      return "sort[0]=price_current:asc";
    case "price-desc":
      return "sort[0]=price_current:desc";
    case "year-desc":
      return "sort[0]=year:desc";
    case "year-asc":
      return "sort[0]=year:asc";
    case "length-asc":
      return "sort[0]=vehicle_body_length:asc";
    case "length-desc":
      return "sort[0]=vehicle_body_length:desc";
    default:
      return "sort[0]=lot_status:asc&sort[1]=received_date:asc";
  }
}

export async function fetchInventory(
  params: FilterParams = {}
): Promise<InventoryResponse> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 12;

  const filterString = buildFilterString(params);
  const sortString = buildSortString(params.sort);

  const url = `${BASE_URL}/inventory/?${filterString}&${sortString}&company[0]=${COMPANY_ID}&withUnitData=1&page=${page}&pageSize=${pageSize}`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchUnitById(id: number): Promise<InventoryUnit | null> {
  const url = `${BASE_URL}/inventory/?filters[$and][0][id][$eq]=${id}&company[0]=${COMPANY_ID}&withUnitData=1`;

  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: InventoryResponse = await response.json();
  return data.data[0] || null;
}

export async function fetchFeaturedInventory(): Promise<InventoryUnit[]> {
  const url = `${BASE_URL}/inventory/?filters[$and][0][displayOnWebsite][$eq]=true&filters[$and][1][web_settings][featured][$eq]=true&sort[0]=received_date:desc&company[0]=${COMPANY_ID}&withUnitData=1&pageSize=12`;

  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    // Fallback to regular inventory if no featured
    const fallback = await fetchInventory({ pageSize: 12 });
    return fallback.data;
  }

  const data: InventoryResponse = await response.json();

  // If no featured items, return regular inventory
  if (data.data.length === 0) {
    const fallback = await fetchInventory({ pageSize: 12 });
    return fallback.data;
  }

  return data.data;
}

export async function fetchMakes(): Promise<string[]> {
  const response = await fetchInventory({ pageSize: 200 });
  const makes = new Set<string>();

  response.data.forEach((unit) => {
    if (unit.unit_make?.name) {
      makes.add(unit.unit_make.name);
    }
  });

  return Array.from(makes).sort();
}

export async function fetchTypes(): Promise<string[]> {
  const response = await fetchInventory({ pageSize: 200 });
  const types = new Set<string>();

  response.data.forEach((unit) => {
    if (unit.unit_classification?.name) {
      types.add(unit.unit_classification.name);
    }
  });

  return Array.from(types).sort();
}
```

**Step 2: Commit**

```bash
git add lib/api.ts
git commit -m "feat: add API client for inventory fetching"
```

---

### Task 2.3: Create Utility Functions

**Files:**
- Create: `lib/utils.ts`

**Step 1: Create utils file**

```typescript
// lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return "Call for Price";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number | null): string {
  if (num === null || num === undefined) return "N/A";
  return new Intl.NumberFormat("en-US").format(num);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateUnitSlug(unit: {
  id: number;
  year: number;
  unit_make: { name: string };
  unit_model: { name: string };
  stock_number: string;
}): string {
  const parts = [
    unit.year,
    unit.unit_make.name,
    unit.unit_model.name,
    unit.stock_number,
  ];
  return slugify(parts.join(" "));
}

export function parseUnitIdFromSlug(slug: string): number | null {
  // Stock number is typically at the end of slug
  // We'll need to lookup by stock number or store ID in URL
  const match = slug.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

export function calculateSavings(msrp: number, current: number): number {
  return Math.max(0, msrp - current);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getImageUrl(url: string | null, fallback: string = "/images/placeholder-rv.jpg"): string {
  if (!url) return fallback;
  return url;
}
```

**Step 2: Commit**

```bash
git add lib/utils.ts
git commit -m "feat: add utility functions"
```

---

### Task 2.4: Setup React Query Provider

**Files:**
- Create: `components/providers/QueryProvider.tsx`
- Modify: `app/layout.tsx`

**Step 1: Create Query Provider**

```typescript
// components/providers/QueryProvider.tsx

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Step 2: Update layout to use provider**

Update `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Terry Town RV | World's Largest Indoor RV Showroom",
  description: "Shop the world's largest indoor RV showroom. Browse travel trailers, fifth wheels, motorhomes, and more from top brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
```

**Step 3: Commit**

```bash
mkdir -p components/providers
git add components/providers/QueryProvider.tsx app/layout.tsx
git commit -m "feat: setup React Query provider"
```

---

## Phase 3: Layout Components

### Task 3.1: Create Header Component

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/TopBar.tsx`
- Create: `components/layout/Navigation.tsx`
- Create: `components/layout/MobileNav.tsx`

**Step 1: Create TopBar**

```typescript
// components/layout/TopBar.tsx

import { Phone } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="bg-primary-dark text-white text-sm py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <a
            href="tel:6166258037"
            className="flex items-center gap-2 hover:text-accent transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Sales: (616) 625-8037</span>
          </a>
          <a
            href="tel:6166258023"
            className="hidden sm:flex items-center gap-2 hover:text-accent transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Service: (616) 625-8023</span>
          </a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/about" className="hover:text-accent transition-colors">
            About Us
          </Link>
          <Link href="/careers" className="hover:text-accent transition-colors">
            Careers
          </Link>
          <Link href="/contact" className="hover:text-accent transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create Navigation**

```typescript
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
```

**Step 3: Create MobileNav**

```typescript
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
```

**Step 4: Create main Header**

```typescript
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
```

**Step 5: Commit**

```bash
mkdir -p components/layout
git add components/layout/
git commit -m "feat: add Header with TopBar, Navigation, and MobileNav"
```

---

### Task 3.2: Create Footer Component

**Files:**
- Create: `components/layout/Footer.tsx`

**Step 1: Create Footer**

```typescript
// components/layout/Footer.tsx

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

const quickLinks = [
  { name: "Search RVs", href: "/inventory" },
  { name: "Today's Deals", href: "/inventory?deals=true" },
  { name: "Financing", href: "/financing" },
  { name: "Trade-In", href: "/contact?subject=trade-in" },
  { name: "Service", href: "/service" },
  { name: "Parts", href: "/parts" },
];

const rvTypes = [
  { name: "Travel Trailers", href: "/inventory?type=Travel+Trailer" },
  { name: "Fifth Wheels", href: "/inventory?type=Fifth+Wheel" },
  { name: "Class A Motorhomes", href: "/inventory?type=Class+A" },
  { name: "Class C Motorhomes", href: "/inventory?type=Class+C" },
  { name: "Toy Haulers", href: "/inventory?type=Toy+Hauler" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
  { name: "Testimonials", href: "/about#testimonials" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-xl mb-4">Terry Town RV</h3>
            <p className="text-gray-300 mb-4">
              The World's Largest Indoor RV Showroom
            </p>
            <div className="space-y-2">
              <a
                href="tel:6166258037"
                className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4" />
                (616) 625-8037
              </a>
              <a
                href="mailto:sales@terrytownrv.com"
                className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors"
              >
                <Mail className="w-4 h-4" />
                sales@terrytownrv.com
              </a>
              <div className="flex items-start gap-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>
                  7817 US-131<br />
                  Grand Rapids, MI 49548
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RV Types */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">RV Types</h3>
            <ul className="space-y-2">
              {rvTypes.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-light">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Terry Town RV. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat: add Footer component"
```

---

### Task 3.3: Create Context Providers for Favorites and Compare

**Files:**
- Create: `context/FavoritesContext.tsx`
- Create: `context/CompareContext.tsx`
- Create: `hooks/useLocalStorage.ts`

**Step 1: Create useLocalStorage hook**

```typescript
// hooks/useLocalStorage.ts

"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
    setIsHydrated(true);
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return { value: storedValue, setValue, isHydrated };
}
```

**Step 2: Create FavoritesContext**

```typescript
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
```

**Step 3: Create CompareContext**

```typescript
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
```

**Step 4: Update layout with providers**

Update `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CompareProvider } from "@/context/CompareContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Terry Town RV | World's Largest Indoor RV Showroom",
  description:
    "Shop the world's largest indoor RV showroom. Browse travel trailers, fifth wheels, motorhomes, and more from top brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans flex flex-col min-h-screen">
        <QueryProvider>
          <FavoritesProvider>
            <CompareProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CompareProvider>
          </FavoritesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

**Step 5: Commit**

```bash
mkdir -p context hooks
git add context/ hooks/ app/layout.tsx
git commit -m "feat: add Favorites and Compare context providers"
```

---

---

## Phase 4: Homepage Components

### Task 4.1: Create RV Card Component

**Files:**
- Create: `components/inventory/RVCard.tsx`

**Step 1: Create RVCard component**

```typescript
// components/inventory/RVCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, GitCompare, Ruler, Users, Layers } from "lucide-react";
import { InventoryUnit } from "@/lib/types";
import { formatPrice, calculateSavings, getImageUrl } from "@/lib/utils";
import { useFavorites } from "@/context/FavoritesContext";
import { useCompare } from "@/context/CompareContext";
import { cn } from "@/lib/utils";

interface RVCardProps {
  unit: InventoryUnit;
}

export function RVCard({ unit }: RVCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleCompare, isInCompare, canAddMore } = useCompare();

  const favorite = isFavorite(unit.id);
  const inCompare = isInCompare(unit.id);
  const savings = calculateSavings(unit.price_msrp, unit.price_current);
  const slug = `${unit.year}-${unit.unit_make?.name}-${unit.unit_model?.name}-${unit.stock_number}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

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
              {unit.condition}
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
              {Math.round(unit.vehicle_body_length)}'
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
```

**Step 2: Commit**

```bash
mkdir -p components/inventory
git add components/inventory/RVCard.tsx
git commit -m "feat: add RVCard component"
```

---

### Task 4.2: Create Hero Banner Component

**Files:**
- Create: `components/home/HeroBanner.tsx`

**Step 1: Create HeroBanner**

```typescript
// components/home/HeroBanner.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-primary-dark to-primary text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            The World's Largest Indoor RV Showroom
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Shop year-round in climate-controlled comfort. Browse hundreds of travel trailers, fifth wheels, and motorhomes from top brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/inventory" className="btn btn-accent text-lg px-8 py-3">
              Browse Inventory
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/contact?subject=trade-in"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3"
            >
              Value Your Trade
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
```

**Step 2: Commit**

```bash
mkdir -p components/home
git add components/home/HeroBanner.tsx
git commit -m "feat: add HeroBanner component"
```

---

### Task 4.3: Create Quick Search Component

**Files:**
- Create: `components/home/QuickSearch.tsx`

**Step 1: Create QuickSearch**

```typescript
// components/home/QuickSearch.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const rvTypes = [
  { value: "", label: "All Types" },
  { value: "Travel Trailer", label: "Travel Trailers" },
  { value: "Fifth Wheel", label: "Fifth Wheels" },
  { value: "Class A", label: "Class A Motorhomes" },
  { value: "Class B", label: "Class B Motorhomes" },
  { value: "Class C", label: "Class C Motorhomes" },
  { value: "Toy Hauler", label: "Toy Haulers" },
];

const priceRanges = [
  { value: "", label: "Any Price" },
  { value: "0-25000", label: "Under $25,000" },
  { value: "25000-50000", label: "$25,000 - $50,000" },
  { value: "50000-75000", label: "$50,000 - $75,000" },
  { value: "75000-100000", label: "$75,000 - $100,000" },
  { value: "100000-", label: "$100,000+" },
];

export function QuickSearch() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (type) params.set("type", type);
    if (priceRange) {
      const [min, max] = priceRange.split("-");
      if (min) params.set("minPrice", min);
      if (max) params.set("maxPrice", max);
    }
    if (keyword) params.set("search", keyword);

    router.push(`/inventory?${params.toString()}`);
  };

  return (
    <section className="bg-white -mt-8 relative z-10">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6 text-center">
            Find Your Perfect RV
          </h2>
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  RV Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="input"
                >
                  {rvTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price Range
                </label>
                <select
                  id="price"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="input"
                >
                  {priceRanges.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="keyword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Keyword
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Model, stock #, etc."
                  className="input"
                />
              </div>

              <div className="flex items-end">
                <button type="submit" className="btn btn-primary w-full py-2.5">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/home/QuickSearch.tsx
git commit -m "feat: add QuickSearch component"
```

---

### Task 4.4: Create Featured Inventory Component

**Files:**
- Create: `components/home/FeaturedInventory.tsx`

**Step 1: Create FeaturedInventory**

```typescript
// components/home/FeaturedInventory.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RVCard } from "@/components/inventory/RVCard";
import { fetchFeaturedInventory } from "@/lib/api";

export async function FeaturedInventory() {
  const units = await fetchFeaturedInventory();

  if (!units || units.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-heading text-3xl font-bold text-gray-900">
              Featured RVs
            </h2>
            <p className="text-gray-600 mt-2">
              Hand-picked selection of our best inventory
            </p>
          </div>
          <Link
            href="/inventory"
            className="hidden sm:flex items-center text-primary font-medium hover:text-primary-dark transition-colors"
          >
            View All
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {units.slice(0, 8).map((unit) => (
            <RVCard key={unit.id} unit={unit} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/inventory" className="btn btn-primary">
            View All Inventory
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add components/home/FeaturedInventory.tsx
git commit -m "feat: add FeaturedInventory component"
```

---

### Task 4.5: Create Value Props and Brand Showcase

**Files:**
- Create: `components/home/ValueProps.tsx`
- Create: `components/home/BrandShowcase.tsx`

**Step 1: Create ValueProps**

```typescript
// components/home/ValueProps.tsx

import { Building2, Shield, DollarSign, Wrench } from "lucide-react";

const props = [
  {
    icon: Building2,
    title: "Largest Indoor Showroom",
    description:
      "Shop year-round in our climate-controlled facility with hundreds of RVs on display.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description:
      "Every RV undergoes a thorough inspection before it hits our showroom floor.",
  },
  {
    icon: DollarSign,
    title: "Best Price Promise",
    description:
      "Competitive pricing and flexible financing options to fit your budget.",
  },
  {
    icon: Wrench,
    title: "Expert Service",
    description:
      "Full-service department with certified technicians for all your RV needs.",
  },
];

export function ValueProps() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose Terry Town RV
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <prop.icon className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                {prop.title}
              </h3>
              <p className="text-gray-600">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Create BrandShowcase**

```typescript
// components/home/BrandShowcase.tsx

import Link from "next/link";

const brands = [
  "Jayco",
  "Keystone",
  "Forest River",
  "Grand Design",
  "Thor",
  "Winnebago",
  "Coachmen",
  "Heartland",
  "Dutchmen",
  "KZ RV",
  "Palomino",
  "CrossRoads",
];

export function BrandShowcase() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-4">
          Shop Top Brands
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          We carry the most trusted names in the RV industry
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand}
              href={`/inventory?make=${encodeURIComponent(brand)}`}
              className="flex items-center justify-center h-20 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow px-4 text-center"
            >
              <span className="font-heading font-bold text-gray-700 hover:text-primary transition-colors">
                {brand}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Commit**

```bash
git add components/home/ValueProps.tsx components/home/BrandShowcase.tsx
git commit -m "feat: add ValueProps and BrandShowcase components"
```

---

### Task 4.6: Create Homepage

**Files:**
- Modify: `app/page.tsx`

**Step 1: Update homepage**

```typescript
// app/page.tsx

import { HeroBanner } from "@/components/home/HeroBanner";
import { QuickSearch } from "@/components/home/QuickSearch";
import { FeaturedInventory } from "@/components/home/FeaturedInventory";
import { ValueProps } from "@/components/home/ValueProps";
import { BrandShowcase } from "@/components/home/BrandShowcase";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <QuickSearch />
      <FeaturedInventory />
      <ValueProps />
      <BrandShowcase />
    </>
  );
}
```

**Step 2: Verify homepage loads**

```bash
npm run dev
```

Open http://localhost:3000 - should see homepage with all sections.

**Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: complete homepage with all sections"
```

---

## Phase 5: Inventory Listing Page

### Task 5.1: Create Filter Panel Component

**Files:**
- Create: `components/inventory/FilterPanel.tsx`

**Step 1: Create FilterPanel**

```typescript
// components/inventory/FilterPanel.tsx

"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  filters: {
    search: string;
    types: string[];
    makes: string[];
    conditions: string[];
    minPrice: string;
    maxPrice: string;
    minYear: string;
    maxYear: string;
    minSleeps: string;
    slideouts: string[];
  };
  availableFilters: {
    types: string[];
    makes: string[];
    priceRange: { min: number; max: number };
    yearRange: { min: number; max: number };
  };
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function FilterSection({ title, defaultOpen = true, children }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function FilterPanel({
  filters,
  availableFilters,
  onFilterChange,
  onClearFilters,
  onClose,
  isMobile = false,
}: FilterPanelProps) {
  const rvTypes = [
    "Travel Trailer",
    "Fifth Wheel",
    "Class A",
    "Class B",
    "Class C",
    "Toy Hauler",
  ];

  const conditions = ["New", "Used"];

  const handleCheckboxChange = (
    key: string,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[key as keyof typeof filters] as string[];
    if (checked) {
      onFilterChange(key, [...currentValues, value]);
    } else {
      onFilterChange(
        key,
        currentValues.filter((v) => v !== value)
      );
    }
  };

  return (
    <div className={cn("bg-white", isMobile && "h-full flex flex-col")}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-heading font-bold text-lg">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearFilters}
            className="text-sm text-primary hover:text-primary-dark"
          >
            Clear All
          </button>
          {isMobile && onClose && (
            <button onClick={onClose} className="p-1">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={cn("p-4 overflow-y-auto", isMobile && "flex-1")}>
        {/* Keyword Search */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Stock #, model, keyword..."
            className="input"
          />
        </div>

        {/* RV Type */}
        <FilterSection title="RV Type">
          <div className="space-y-2">
            {rvTypes.map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type)}
                  onChange={(e) =>
                    handleCheckboxChange("types", type, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Condition */}
        <FilterSection title="Condition">
          <div className="space-y-2">
            {conditions.map((condition) => (
              <label key={condition} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(condition)}
                  onChange={(e) =>
                    handleCheckboxChange("conditions", condition, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{condition}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => onFilterChange("minPrice", e.target.value)}
              placeholder="Min"
              className="input"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              placeholder="Max"
              className="input"
            />
          </div>
        </FilterSection>

        {/* Year Range */}
        <FilterSection title="Year">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.minYear}
              onChange={(e) => onFilterChange("minYear", e.target.value)}
              placeholder="Min"
              className="input"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={filters.maxYear}
              onChange={(e) => onFilterChange("maxYear", e.target.value)}
              placeholder="Max"
              className="input"
            />
          </div>
        </FilterSection>

        {/* Sleeping Capacity */}
        <FilterSection title="Sleeps">
          <select
            value={filters.minSleeps}
            onChange={(e) => onFilterChange("minSleeps", e.target.value)}
            className="input"
          >
            <option value="">Any</option>
            <option value="2">2+</option>
            <option value="4">4+</option>
            <option value="6">6+</option>
            <option value="8">8+</option>
            <option value="10">10+</option>
          </select>
        </FilterSection>

        {/* Slideouts */}
        <FilterSection title="Slideouts">
          <div className="space-y-2">
            {["0", "1", "2", "3"].map((num) => (
              <label key={num} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.slideouts.includes(num)}
                  onChange={(e) =>
                    handleCheckboxChange("slideouts", num, e.target.checked)
                  }
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">
                  {num === "0" ? "None" : num === "3" ? "3+" : num}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Make */}
        {availableFilters.makes.length > 0 && (
          <FilterSection title="Make" defaultOpen={false}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableFilters.makes.map((make) => (
                <label key={make} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.makes.includes(make)}
                    onChange={(e) =>
                      handleCheckboxChange("makes", make, e.target.checked)
                    }
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{make}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
      </div>

      {/* Mobile Apply Button */}
      {isMobile && (
        <div className="p-4 border-t">
          <button onClick={onClose} className="btn btn-primary w-full">
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/inventory/FilterPanel.tsx
git commit -m "feat: add FilterPanel component"
```

---

### Task 5.2: Create Inventory Page

**Files:**
- Create: `app/inventory/page.tsx`
- Create: `components/inventory/InventoryGrid.tsx`
- Create: `components/inventory/Pagination.tsx`

**Step 1: Create Pagination**

```typescript
// components/inventory/Pagination.tsx

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  // Calculate range around current page
  const rangeStart = Math.max(2, currentPage - 1);
  const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

  // Add ellipsis if needed before range
  if (rangeStart > 2) {
    pages.push("...");
  }

  // Add pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Add ellipsis if needed after range
  if (rangeEnd < totalPages - 1) {
    pages.push("...");
  }

  // Always show last page if more than 1 page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded hover:bg-gray-100 transition-colors",
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page, idx) =>
        typeof page === "number" ? (
          <button
            key={idx}
            onClick={() => onPageChange(page)}
            className={cn(
              "w-10 h-10 rounded font-medium transition-colors",
              page === currentPage
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            )}
          >
            {page}
          </button>
        ) : (
          <span key={idx} className="px-2 text-gray-400">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded hover:bg-gray-100 transition-colors",
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
```

**Step 2: Create InventoryGrid**

```typescript
// components/inventory/InventoryGrid.tsx

import { InventoryUnit } from "@/lib/types";
import { RVCard } from "./RVCard";

interface InventoryGridProps {
  units: InventoryUnit[];
  isLoading?: boolean;
}

export function InventoryGrid({ units, isLoading }: InventoryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="aspect-[4/3] bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500 mb-4">No RVs found matching your criteria</p>
        <p className="text-gray-400">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {units.map((unit) => (
        <RVCard key={unit.id} unit={unit} />
      ))}
    </div>
  );
}
```

**Step 3: Create inventory page**

```typescript
// app/inventory/page.tsx

"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, Grid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchInventory, fetchMakes } from "@/lib/api";
import { FilterPanel } from "@/components/inventory/FilterPanel";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { Pagination } from "@/components/inventory/Pagination";
import { cn } from "@/lib/utils";

function InventoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse filters from URL
  const getFiltersFromURL = useCallback(() => {
    return {
      search: searchParams.get("search") || "",
      types: searchParams.getAll("type"),
      makes: searchParams.getAll("make"),
      conditions: searchParams.getAll("condition"),
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      minYear: searchParams.get("minYear") || "",
      maxYear: searchParams.get("maxYear") || "",
      minSleeps: searchParams.get("minSleeps") || "",
      slideouts: searchParams.getAll("slideouts"),
    };
  }, [searchParams]);

  const [filters, setFilters] = useState(getFiltersFromURL);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const sort = searchParams.get("sort") || "";

  // Update filters when URL changes
  useEffect(() => {
    setFilters(getFiltersFromURL());
  }, [getFiltersFromURL]);

  // Fetch inventory
  const { data, isLoading } = useQuery({
    queryKey: ["inventory", filters, page, sort],
    queryFn: () =>
      fetchInventory({
        page,
        pageSize: 12,
        search: filters.search || undefined,
        type: filters.types.length > 0 ? filters.types : undefined,
        make: filters.makes.length > 0 ? filters.makes : undefined,
        condition: filters.conditions.length > 0 ? filters.conditions : undefined,
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
        minYear: filters.minYear ? parseInt(filters.minYear) : undefined,
        maxYear: filters.maxYear ? parseInt(filters.maxYear) : undefined,
        minSleeps: filters.minSleeps ? parseInt(filters.minSleeps) : undefined,
        slideouts: filters.slideouts.length > 0 ? filters.slideouts.map(Number) : undefined,
        sort: sort || undefined,
      }),
  });

  // Fetch makes for filter
  const { data: makes = [] } = useQuery({
    queryKey: ["makes"],
    queryFn: fetchMakes,
  });

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: typeof filters, newPage = 1, newSort = sort) => {
      const params = new URLSearchParams();

      if (newFilters.search) params.set("search", newFilters.search);
      newFilters.types.forEach((t) => params.append("type", t));
      newFilters.makes.forEach((m) => params.append("make", m));
      newFilters.conditions.forEach((c) => params.append("condition", c));
      if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
      if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
      if (newFilters.minYear) params.set("minYear", newFilters.minYear);
      if (newFilters.maxYear) params.set("maxYear", newFilters.maxYear);
      if (newFilters.minSleeps) params.set("minSleeps", newFilters.minSleeps);
      newFilters.slideouts.forEach((s) => params.append("slideouts", s));
      if (newPage > 1) params.set("page", String(newPage));
      if (newSort) params.set("sort", newSort);

      router.push(`/inventory?${params.toString()}`, { scroll: false });
    },
    [router, sort]
  );

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      types: [],
      makes: [],
      conditions: [],
      minPrice: "",
      maxPrice: "",
      minYear: "",
      maxYear: "",
      minSleeps: "",
      slideouts: [],
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  };

  const handlePageChange = (newPage: number) => {
    updateURL(filters, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort: string) => {
    updateURL(filters, 1, newSort);
  };

  const totalPages = data?.pagination?.last_page || 1;
  const totalResults = data?.pagination?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-8">
          Search Our Inventory
        </h1>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                filters={filters}
                availableFilters={{
                  types: [],
                  makes,
                  priceRange: { min: 0, max: 500000 },
                  yearRange: { min: 2015, max: new Date().getFullYear() + 1 },
                }}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden btn btn-outline py-2 px-3"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </button>
                <span className="text-gray-600">
                  {totalResults} {totalResults === 1 ? "result" : "results"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="input py-2 w-auto"
                >
                  <option value="">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Year: Newest</option>
                  <option value="year-asc">Year: Oldest</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <InventoryGrid units={data?.data || []} isLoading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden">
            <FilterPanel
              filters={filters}
              availableFilters={{
                types: [],
                makes,
                priceRange: { min: 0, max: 500000 },
                yearRange: { min: 2015, max: new Date().getFullYear() + 1 },
              }}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onClose={() => setShowMobileFilters(false)}
              isMobile
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <InventoryPageContent />
    </Suspense>
  );
}
```

**Step 4: Commit**

```bash
mkdir -p app/inventory
git add components/inventory/Pagination.tsx components/inventory/InventoryGrid.tsx app/inventory/page.tsx
git commit -m "feat: add inventory listing page with filters and pagination"
```

---

## Phase 6: RV Detail Page

### Task 6.1: Create Detail Page Components

**Files:**
- Create: `components/detail/ImageGallery.tsx`
- Create: `components/detail/SpecsTable.tsx`
- Create: `components/detail/ContactForm.tsx`

**Step 1: Create ImageGallery**

```typescript
// components/detail/ImageGallery.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MediaItem } from "@/lib/types";
import { getImageUrl, cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: MediaItem[];
  displayImage: string | null;
  alt: string;
}

export function ImageGallery({ images, displayImage, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Combine display image with media images
  const allImages = [
    displayImage,
    ...images.filter((img) => img.type === "image").map((img) => img.url),
  ].filter(Boolean) as string[];

  if (allImages.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  const currentImage = allImages[selectedIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => setShowLightbox(true)}
        >
          <Image
            src={getImageUrl(currentImage)}
            alt={alt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                  idx === selectedIndex
                    ? "border-primary"
                    : "border-transparent hover:border-gray-300"
                )}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`${alt} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev === 0 ? allImages.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 p-2 text-white hover:text-gray-300"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev === allImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 p-2 text-white hover:text-gray-300"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}

          <div className="relative w-full h-full max-w-6xl max-h-[90vh] m-4">
            <Image
              src={getImageUrl(currentImage)}
              alt={alt}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
```

**Step 2: Create SpecsTable**

```typescript
// components/detail/SpecsTable.tsx

import { InventoryUnit } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

interface SpecsTableProps {
  unit: InventoryUnit;
}

interface SpecRow {
  label: string;
  value: string | number | null | undefined;
  format?: (val: any) => string;
}

export function SpecsTable({ unit }: SpecsTableProps) {
  const dimensions: SpecRow[] = [
    { label: "Length", value: unit.vehicle_body_length, format: (v) => `${Math.round(v)}' ` },
    { label: "Height", value: unit.vehicle_body_height, format: (v) => `${v.toFixed(1)}' ` },
    { label: "Width", value: unit.vehicle_body_width, format: (v) => `${v}' ` },
    { label: "Dry Weight", value: unit.dry_weight, format: (v) => `${formatNumber(v)} lbs` },
    { label: "GVWR", value: unit.gvwr, format: (v) => `${formatNumber(v)} lbs` },
    { label: "Hitch Weight", value: unit.hitch_weight, format: (v) => `${formatNumber(v)} lbs` },
  ];

  const capacities: SpecRow[] = [
    { label: "Fresh Water", value: unit.total_fresh_water_tank_capacity, format: (v) => `${v} gal` },
    { label: "Gray Water", value: unit.total_gray_water_tank_capacity, format: (v) => `${v} gal` },
    { label: "Black Water", value: unit.total_black_water_tank_capacity, format: (v) => `${v} gal` },
    { label: "Fuel Tank", value: unit.fuel_tank_capacity, format: (v) => `${v} gal` },
    { label: "Water Heater", value: unit.water_heater_tank_capacity, format: (v) => `${v} gal` },
  ];

  const features: SpecRow[] = [
    { label: "Sleeps", value: unit.max_sleeping_count },
    { label: "Slideouts", value: unit.number_of_slideouts },
    { label: "Awning Length", value: unit.awning_length, format: (v) => `${v}' ` },
    { label: "A/C BTU", value: unit.air_conditioning_btu, format: (v) => formatNumber(v) },
    { label: "Heater BTU", value: unit.heater_btu, format: (v) => formatNumber(v) },
  ];

  const engine: SpecRow[] = [
    { label: "Engine", value: unit.engine },
    { label: "Fuel Type", value: unit.fuel_type },
    { label: "Horsepower", value: unit.horsepower, format: (v) => `${v} HP` },
    { label: "Torque", value: unit.torque, format: (v) => `${v} lb-ft` },
    { label: "Chassis", value: unit.chassis_brand },
    { label: "Towing Capacity", value: unit.towing_capacity, format: (v) => `${formatNumber(v)} lbs` },
  ];

  const renderSection = (title: string, rows: SpecRow[]) => {
    const validRows = rows.filter((row) => row.value !== null && row.value !== undefined);
    if (validRows.length === 0) return null;

    return (
      <div>
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
          {title}
        </h3>
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          {validRows.map((row, idx) => (
            <div
              key={row.label}
              className={`flex justify-between px-4 py-3 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <span className="text-gray-600">{row.label}</span>
              <span className="font-medium text-gray-900">
                {row.format ? row.format(row.value) : row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {renderSection("Dimensions & Weight", dimensions)}
      {renderSection("Capacities", capacities)}
      {renderSection("Features", features)}
      {renderSection("Engine & Performance", engine)}
    </div>
  );
}
```

**Step 3: Create ContactForm**

```typescript
// components/detail/ContactForm.tsx

"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface ContactFormProps {
  unitInfo: string;
}

export function ContactForm({ unitInfo }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in the ${unitInfo}. Please contact me with more information.`,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-800 font-medium">Thank you for your inquiry!</p>
        <p className="text-green-600 mt-2">We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="input resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? (
          "Sending..."
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Send Inquiry
          </>
        )}
      </button>
    </form>
  );
}
```

**Step 4: Commit**

```bash
mkdir -p components/detail
git add components/detail/
git commit -m "feat: add detail page components (ImageGallery, SpecsTable, ContactForm)"
```

---

### Task 6.2: Create RV Detail Page

**Files:**
- Create: `app/inventory/[id]/page.tsx`

**Step 1: Create detail page**

```typescript
// app/inventory/[id]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, GitCompare, Phone, MapPin, ArrowLeft } from "lucide-react";
import { fetchUnitById, fetchInventory } from "@/lib/api";
import { formatPrice, calculateSavings } from "@/lib/utils";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { SpecsTable } from "@/components/detail/SpecsTable";
import { ContactForm } from "@/components/detail/ContactForm";
import { RVCard } from "@/components/inventory/RVCard";
import { DetailActions } from "./DetailActions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const unit = await fetchUnitById(parseInt(id, 10));

  if (!unit) {
    return { title: "RV Not Found | Terry Town RV" };
  }

  const title = `${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name} | Terry Town RV`;
  const description = `Shop this ${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name} at Terry Town RV. ${formatPrice(unit.price_current)}. ${unit.max_sleeping_count ? `Sleeps ${unit.max_sleeping_count}.` : ""} ${unit.number_of_slideouts ? `${unit.number_of_slideouts} slideouts.` : ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: unit.display_image ? [unit.display_image] : [],
    },
  };
}

export default async function DetailPage({ params }: PageProps) {
  const { id } = await params;
  const unit = await fetchUnitById(parseInt(id, 10));

  if (!unit) {
    notFound();
  }

  const savings = calculateSavings(unit.price_msrp, unit.price_current);
  const unitTitle = `${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name}`;

  // Fetch related units
  const relatedResponse = await fetchInventory({
    type: unit.unit_classification?.name ? [unit.unit_classification.name] : undefined,
    pageSize: 4,
  });
  const relatedUnits = relatedResponse.data.filter((u) => u.id !== unit.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/inventory"
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <ImageGallery
              images={unit.media || []}
              displayImage={unit.display_image}
              alt={unitTitle}
            />

            {/* Title & Quick Info (Mobile) */}
            <div className="lg:hidden">
              <h1 className="font-heading text-2xl font-bold text-gray-900">
                {unitTitle}
              </h1>
              {unit.unit_trim?.name && (
                <p className="text-lg text-gray-600 mt-1">{unit.unit_trim.name}</p>
              )}
              <div className="flex items-center gap-4 mt-4">
                <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded">
                  {unit.condition || "New"}
                </span>
                <span className="text-gray-500">Stock #{unit.stock_number}</span>
              </div>
            </div>

            {/* Description */}
            {unit.inventory_unit_descriptions?.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">
                  Overview
                </h2>
                {unit.inventory_unit_descriptions.map((desc) => (
                  <div key={desc.id} className="prose prose-gray max-w-none">
                    {desc.heading && (
                      <h3 className="text-lg font-medium">{desc.heading}</h3>
                    )}
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {desc.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Specifications */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="font-heading font-bold text-xl text-gray-900 mb-6">
                Specifications
              </h2>
              <SpecsTable unit={unit} />
            </div>

            {/* Options */}
            {unit.inventory_unit_options?.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="font-heading font-bold text-xl text-gray-900 mb-4">
                  Options & Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {unit.inventory_unit_options.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      {opt.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                {/* Title (Desktop) */}
                <div className="hidden lg:block mb-4">
                  <h1 className="font-heading text-xl font-bold text-gray-900">
                    {unitTitle}
                  </h1>
                  {unit.unit_trim?.name && (
                    <p className="text-gray-600">{unit.unit_trim.name}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    <span className="bg-primary text-white text-sm font-bold px-3 py-1 rounded">
                      {unit.condition || "New"}
                    </span>
                    <span className="text-gray-500 text-sm">
                      Stock #{unit.stock_number}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="border-t pt-4">
                  {savings > 0 && (
                    <>
                      <p className="text-gray-400 line-through">
                        MSRP {formatPrice(unit.price_msrp)}
                      </p>
                      <p className="text-secondary font-bold">
                        Save {formatPrice(savings)}
                      </p>
                    </>
                  )}
                  <p className="text-3xl font-bold text-primary mt-2">
                    {formatPrice(unit.price_current)}
                  </p>
                  {unit.price_monthly && (
                    <p className="text-gray-600">
                      Est. {formatPrice(unit.price_monthly)}/mo
                    </p>
                  )}
                </div>

                {/* Actions */}
                <DetailActions unitId={unit.id} />

                {/* Contact Buttons */}
                <div className="space-y-3 mt-6">
                  <a
                    href="tel:6166258037"
                    className="btn btn-primary w-full justify-center"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call (616) 625-8037
                  </a>
                  <Link
                    href={`/contact?unit=${unit.stock_number}`}
                    className="btn btn-outline w-full justify-center"
                  >
                    Request Info
                  </Link>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
                  Get More Info
                </h3>
                <ContactForm unitInfo={unitTitle} />
              </div>

              {/* Location */}
              {unit.company_location && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">
                    Location
                  </h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">{unit.company_location.company?.name}</p>
                      <p className="text-gray-600">{unit.company_location.address}</p>
                      <p className="text-gray-600">
                        {unit.company_location.city}, {unit.company_location.state}{" "}
                        {unit.company_location.zip}
                      </p>
                      {unit.company_location.phone && (
                        <a
                          href={`tel:${unit.company_location.phone.replace(/\D/g, "")}`}
                          className="text-primary hover:text-primary-dark mt-2 inline-block"
                        >
                          {unit.company_location.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Units */}
        {relatedUnits.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-8">
              Similar RVs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedUnits.map((relatedUnit) => (
                <RVCard key={relatedUnit.id} unit={relatedUnit} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Create DetailActions client component**

```typescript
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

  const handleCompare = () => {
    if (!inCompare && !canAddMore) {
      alert("You can only compare up to 4 units");
      return;
    }
    toggleCompare(unitId);
  };

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => toggleFavorite(unitId)}
        className={cn(
          "flex-1 btn justify-center",
          favorite ? "btn-secondary" : "btn-outline"
        )}
      >
        <Heart className={cn("w-5 h-5 mr-2", favorite && "fill-current")} />
        {favorite ? "Saved" : "Save"}
      </button>
      <button
        onClick={handleCompare}
        className={cn(
          "flex-1 btn justify-center",
          inCompare ? "btn-primary" : "btn-outline"
        )}
      >
        <GitCompare className="w-5 h-5 mr-2" />
        {inCompare ? "Comparing" : "Compare"}
      </button>
    </div>
  );
}
```

**Step 3: Commit**

```bash
mkdir -p app/inventory/[id]
git add app/inventory/[id]/
git commit -m "feat: add RV detail page with gallery, specs, and contact form"
```

---

---

## Phase 7: Compare & Favorites Pages

### Task 7.1: Create Compare Page

**Files:**
- Create: `app/compare/page.tsx`
- Create: `components/features/CompareBar.tsx`

**Step 1: Create CompareBar (floating bar)**

```typescript
// components/features/CompareBar.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { useQuery } from "@tanstack/react-query";
import { fetchUnitById } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";

export function CompareBar() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  // Fetch unit data for thumbnails
  const { data: units } = useQuery({
    queryKey: ["compare-units", compareItems],
    queryFn: async () => {
      const results = await Promise.all(
        compareItems.map((id) => fetchUnitById(id))
      );
      return results.filter(Boolean);
    },
    enabled: compareItems.length > 0,
  });

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">
              Compare ({compareItems.length}/4):
            </span>
            <div className="flex gap-2">
              {units?.map((unit) => (
                <div key={unit!.id} className="relative">
                  <div className="w-16 h-12 rounded overflow-hidden bg-gray-100">
                    <Image
                      src={getImageUrl(unit!.display_image)}
                      alt={`${unit!.year} ${unit!.unit_make?.name}`}
                      width={64}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCompare(unit!.id)}
                    className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
            <Link href="/compare" className="btn btn-primary">
              Compare Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create Compare page**

```typescript
// app/compare/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, X, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCompare } from "@/context/CompareContext";
import { useFavorites } from "@/context/FavoritesContext";
import { fetchUnitById } from "@/lib/api";
import { formatPrice, formatNumber, getImageUrl, cn } from "@/lib/utils";

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { toggleFavorite, isFavorite } = useFavorites();

  const { data: units, isLoading } = useQuery({
    queryKey: ["compare-units-full", compareItems],
    queryFn: async () => {
      const results = await Promise.all(
        compareItems.map((id) => fetchUnitById(id))
      );
      return results.filter(Boolean);
    },
    enabled: compareItems.length > 0,
  });

  if (compareItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-4">
            No RVs to Compare
          </h1>
          <p className="text-gray-600 mb-6">
            Add RVs to compare by clicking the compare icon on any listing.
          </p>
          <Link href="/inventory" className="btn btn-primary">
            Browse Inventory
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const specRows = [
    { label: "Price", key: "price_current", format: formatPrice },
    { label: "MSRP", key: "price_msrp", format: formatPrice },
    { label: "Year", key: "year" },
    { label: "Condition", key: "condition" },
    { label: "Type", key: "unit_classification", nested: "name" },
    { label: "Length", key: "vehicle_body_length", format: (v: number) => v ? `${Math.round(v)}'` : "N/A" },
    { label: "Dry Weight", key: "dry_weight", format: (v: number) => v ? `${formatNumber(v)} lbs` : "N/A" },
    { label: "GVWR", key: "gvwr", format: (v: number) => v ? `${formatNumber(v)} lbs` : "N/A" },
    { label: "Sleeps", key: "max_sleeping_count" },
    { label: "Slideouts", key: "number_of_slideouts" },
    { label: "Fresh Water", key: "total_fresh_water_tank_capacity", format: (v: number) => v ? `${v} gal` : "N/A" },
    { label: "A/C BTU", key: "air_conditioning_btu", format: (v: number) => v ? formatNumber(v) : "N/A" },
  ];

  const getValue = (unit: any, key: string, nested?: string) => {
    const value = unit[key];
    if (nested && value) return value[nested];
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/inventory"
              className="inline-flex items-center text-primary hover:text-primary-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Compare RVs
            </h1>
          </div>
          <button
            onClick={clearCompare}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px]">
            {/* Header with images */}
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left w-40"></th>
                {units?.map((unit) => (
                  <th key={unit!.id} className="p-4 text-center">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(unit!.id)}
                        className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <Link href={`/inventory/${unit!.id}`}>
                        <div className="aspect-[4/3] relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={getImageUrl(unit!.display_image)}
                            alt={`${unit!.year} ${unit!.unit_make?.name}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="font-heading font-bold text-gray-900 hover:text-primary">
                          {unit!.year} {unit!.unit_make?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {unit!.unit_model?.name}
                        </p>
                      </Link>
                      <button
                        onClick={() => toggleFavorite(unit!.id)}
                        className={cn(
                          "mt-2 p-2 rounded-full transition-colors",
                          isFavorite(unit!.id)
                            ? "text-secondary"
                            : "text-gray-400 hover:text-secondary"
                        )}
                      >
                        <Heart
                          className={cn(
                            "w-5 h-5",
                            isFavorite(unit!.id) && "fill-current"
                          )}
                        />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody>
              {specRows.map((row, idx) => (
                <tr
                  key={row.key}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-4 font-medium text-gray-700">{row.label}</td>
                  {units?.map((unit) => {
                    const value = getValue(unit, row.key, row.nested);
                    const displayValue = row.format
                      ? row.format(value)
                      : value ?? "N/A";
                    return (
                      <td key={unit!.id} className="p-4 text-center">
                        {row.key === "price_current" ? (
                          <span className="text-xl font-bold text-primary">
                            {displayValue}
                          </span>
                        ) : (
                          displayValue
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* View Details row */}
              <tr className="border-t">
                <td className="p-4"></td>
                {units?.map((unit) => (
                  <td key={unit!.id} className="p-4 text-center">
                    <Link
                      href={`/inventory/${unit!.id}`}
                      className="btn btn-primary"
                    >
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

**Step 3: Add CompareBar to layout**

Update `app/layout.tsx` to include CompareBar:

```typescript
// Add import at top:
import { CompareBar } from "@/components/features/CompareBar";

// Add before closing </body>:
<CompareBar />
```

**Step 4: Commit**

```bash
mkdir -p app/compare components/features
git add app/compare/ components/features/CompareBar.tsx app/layout.tsx
git commit -m "feat: add Compare page and CompareBar"
```

---

### Task 7.2: Create Favorites Page

**Files:**
- Create: `app/favorites/page.tsx`

**Step 1: Create Favorites page**

```typescript
// app/favorites/page.tsx

"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useFavorites } from "@/context/FavoritesContext";
import { fetchUnitById } from "@/lib/api";
import { RVCard } from "@/components/inventory/RVCard";

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  const { data: units, isLoading } = useQuery({
    queryKey: ["favorite-units", favorites],
    queryFn: async () => {
      const results = await Promise.all(
        favorites.map((id) => fetchUnitById(id))
      );
      return results.filter(Boolean);
    },
    enabled: favorites.length > 0,
  });

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-4">
            No Saved RVs
          </h1>
          <p className="text-gray-600 mb-6">
            Save RVs you like by clicking the heart icon on any listing.
          </p>
          <Link href="/inventory" className="btn btn-primary">
            Browse Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/inventory"
              className="inline-flex items-center text-primary hover:text-primary-dark"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              My Favorites ({favorites.length})
            </h1>
          </div>
          <button
            onClick={clearFavorites}
            className="inline-flex items-center text-sm text-gray-500 hover:text-secondary"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: favorites.length }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {units?.map((unit) => (
              <RVCard key={unit!.id} unit={unit!} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Commit**

```bash
mkdir -p app/favorites
git add app/favorites/page.tsx
git commit -m "feat: add Favorites page"
```

---

## Phase 8: Content Pages

### Task 8.1: Create About Page

**Files:**
- Create: `app/about/page.tsx`

**Step 1: Create About page**

```typescript
// app/about/page.tsx

import { Building2, Users, Award, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Terry Town RV",
  description: "Learn about Terry Town RV, the world's largest indoor RV showroom. Family-owned and operated since 1972.",
};

const stats = [
  { icon: Building2, value: "200,000+", label: "Sq. Ft. Showroom" },
  { icon: Users, value: "50+", label: "Years Experience" },
  { icon: Award, value: "500+", label: "RVs in Stock" },
  { icon: Clock, value: "6", label: "Days a Week" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            About Terry Town RV
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            The World's Largest Indoor RV Showroom — serving families since 1972.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                Terry Town RV began as a small family business with a simple mission:
                to help families create lasting memories through the joy of RV travel.
                What started as a modest lot has grown into the world's largest indoor
                RV showroom.
              </p>
              <p>
                Our climate-controlled facility allows customers to shop comfortably
                year-round, rain or shine. With over 500 RVs on display at any given
                time, we offer one of the most diverse selections anywhere in the country.
              </p>
              <p>
                We carry all major brands including Jayco, Keystone, Forest River,
                Grand Design, and many more. Whether you're looking for your first
                travel trailer or upgrading to a luxury motorhome, our experienced
                team is here to help you find the perfect fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
            What Sets Us Apart
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                Family Values
              </h3>
              <p className="text-gray-600">
                As a family-owned business, we treat every customer like family.
                Your satisfaction is our top priority.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                Expert Team
              </h3>
              <p className="text-gray-600">
                Our knowledgeable staff are RV enthusiasts themselves, ready to
                share their expertise and help you make informed decisions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                Full Service
              </h3>
              <p className="text-gray-600">
                From sales to service to parts, we're your one-stop shop for
                everything RV-related.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Commit**

```bash
mkdir -p app/about
git add app/about/page.tsx
git commit -m "feat: add About page"
```

---

### Task 8.2: Create Service, Financing, Parts, Contact Pages

**Files:**
- Create: `app/service/page.tsx`
- Create: `app/financing/page.tsx`
- Create: `app/parts/page.tsx`
- Create: `app/contact/page.tsx`

**Step 1: Create Service page**

```typescript
// app/service/page.tsx

import { Wrench, Shield, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Department | Terry Town RV",
  description: "Expert RV service and repairs at Terry Town RV. Certified technicians, quality parts, and fast turnaround.",
};

const services = [
  "Routine Maintenance",
  "AC/Heating Repair",
  "Plumbing Services",
  "Electrical Systems",
  "Roof Repair & Sealing",
  "Slide-Out Service",
  "Winterization",
  "De-Winterization",
  "Appliance Repair",
  "Awning Service",
  "Brake Service",
  "Wheel Bearing Service",
];

export default function ServicePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Service Department
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Keep your RV running smoothly with our certified service team.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Certified Technicians</h3>
              <p className="text-gray-600">Factory-trained experts who know your RV inside and out.</p>
            </div>
            <div className="text-center">
              <Wrench className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Quality Parts</h3>
              <p className="text-gray-600">We use only OEM and high-quality aftermarket parts.</p>
            </div>
            <div className="text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Fast Turnaround</h3>
              <p className="text-gray-600">Get back on the road quickly with efficient service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {services.map((service) => (
              <div key={service} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Schedule Your Service
          </h2>
          <p className="text-gray-200 mb-8 max-w-xl mx-auto">
            Call our service department or stop by to schedule an appointment.
          </p>
          <a href="tel:6166258023" className="btn btn-accent text-lg px-8 py-3">
            <Phone className="w-5 h-5 mr-2" />
            Call (616) 625-8023
          </a>
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Create Financing page**

```typescript
// app/financing/page.tsx

import { DollarSign, CheckCircle, FileText, Phone } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financing | Terry Town RV",
  description: "Flexible RV financing options at Terry Town RV. Competitive rates, easy approval process, and terms that fit your budget.",
};

const benefits = [
  "Competitive interest rates",
  "Flexible terms up to 20 years",
  "Quick approval process",
  "No prepayment penalties",
  "Financing for all credit types",
  "Trade-in options available",
];

export default function FinancingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            RV Financing
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Make your dream RV a reality with flexible financing options.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
              Why Finance With Us?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
            Easy 3-Step Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Apply</h3>
              <p className="text-gray-600">Fill out our quick application online or in-store.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Get Approved</h3>
              <p className="text-gray-600">Receive your approval, often within hours.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">Drive Away</h3>
              <p className="text-gray-600">Sign the paperwork and start your adventure!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-200 mb-8 max-w-xl mx-auto">
            Speak with our finance team to explore your options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:6166258037" className="btn btn-accent text-lg px-8 py-3">
              <Phone className="w-5 h-5 mr-2" />
              Call Us
            </a>
            <Link href="/contact" className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3">
              <FileText className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Step 3: Create Parts page**

```typescript
// app/parts/page.tsx

import { Package, Truck, Phone } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parts Department | Terry Town RV",
  description: "RV parts and accessories at Terry Town RV. Huge inventory, knowledgeable staff, and competitive prices.",
};

export default function PartsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Parts Department
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Everything you need to maintain, upgrade, and customize your RV.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Huge Selection</h3>
              <p className="text-gray-600">Thousands of parts and accessories in stock.</p>
            </div>
            <div className="text-center">
              <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Fast Ordering</h3>
              <p className="text-gray-600">Can't find it? We'll order it for you quickly.</p>
            </div>
            <div className="text-center">
              <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Expert Advice</h3>
              <p className="text-gray-600">Our team can help you find exactly what you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
            Need a Part?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Give us a call or stop by our parts counter. We're here to help!
          </p>
          <a href="tel:6166258037" className="btn btn-primary text-lg px-8 py-3">
            <Phone className="w-5 h-5 mr-2" />
            Call (616) 625-8037
          </a>
        </div>
      </section>
    </div>
  );
}
```

**Step 4: Create Contact page**

```typescript
// app/contact/page.tsx

"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Have questions? We're here to help. Reach out anytime!
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                  Get In Touch
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Sales</p>
                      <a href="tel:6166258037" className="text-primary hover:text-primary-dark">
                        (616) 625-8037
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Service</p>
                      <a href="tel:6166258023" className="text-primary hover:text-primary-dark">
                        (616) 625-8023
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href="mailto:sales@terrytownrv.com" className="text-primary hover:text-primary-dark">
                        sales@terrytownrv.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-gray-600">
                        7817 US-131<br />
                        Grand Rapids, MI 49548
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Hours
                </h3>
                <div className="space-y-1 text-gray-600">
                  <p>Monday - Friday: 9am - 7pm</p>
                  <p>Saturday: 9am - 5pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <p className="text-green-800 font-medium">Thank you for your message!</p>
                    <p className="text-green-600 mt-2">We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="input"
                        >
                          <option value="">Select a topic</option>
                          <option value="sales">Sales Inquiry</option>
                          <option value="service">Service Appointment</option>
                          <option value="parts">Parts Question</option>
                          <option value="trade-in">Trade-In</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="input resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Step 5: Commit**

```bash
mkdir -p app/service app/financing app/parts app/contact
git add app/service/ app/financing/ app/parts/ app/contact/
git commit -m "feat: add content pages (Service, Financing, Parts, Contact)"
```

---

### Task 8.3: Create Careers and Blog Pages

**Files:**
- Create: `app/careers/page.tsx`
- Create: `app/blog/page.tsx`

**Step 1: Create Careers page**

```typescript
// app/careers/page.tsx

import { Users, Heart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Terry Town RV",
  description: "Join the Terry Town RV team. Explore career opportunities at the world's largest indoor RV showroom.",
};

const openings = [
  { title: "Sales Consultant", department: "Sales", type: "Full-time" },
  { title: "Service Technician", department: "Service", type: "Full-time" },
  { title: "Parts Counter", department: "Parts", type: "Full-time" },
  { title: "Detailer", department: "Service", type: "Part-time" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Build your career with a company that values its people.
          </p>
        </div>
      </section>

      {/* Why Join */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
            Why Work at Terry Town RV?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Family Culture</h3>
              <p className="text-gray-600">Be part of a close-knit team that supports each other.</p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">We promote from within and invest in your development.</p>
            </div>
            <div className="text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-xl mb-2">Great Benefits</h3>
              <p className="text-gray-600">Competitive pay, health insurance, and employee discounts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
            Current Openings
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {openings.map((job) => (
              <div key={job.title} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-900">{job.title}</h3>
                  <p className="text-gray-600">{job.department} • {job.type}</p>
                </div>
                <Link href="/contact?subject=careers" className="btn btn-outline">
                  Apply
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Step 2: Create Blog page**

```typescript
// app/blog/page.tsx

import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Terry Town RV",
  description: "RV tips, travel guides, and news from Terry Town RV.",
};

const posts = [
  {
    id: 1,
    title: "10 Tips for First-Time RV Buyers",
    excerpt: "Everything you need to know before purchasing your first RV.",
    date: "January 15, 2026",
    category: "Buying Guide",
  },
  {
    id: 2,
    title: "Best RV Campgrounds in Michigan",
    excerpt: "Discover the top-rated campgrounds across the Great Lakes State.",
    date: "January 10, 2026",
    category: "Travel",
  },
  {
    id: 3,
    title: "Winterizing Your RV: A Complete Guide",
    excerpt: "Protect your investment with proper winter preparation.",
    date: "January 5, 2026",
    category: "Maintenance",
  },
  {
    id: 4,
    title: "RV Towing 101: Matching Your Truck to Your Trailer",
    excerpt: "Understanding tow ratings and making safe towing decisions.",
    date: "December 28, 2025",
    category: "Towing",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            RV Blog
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Tips, guides, and stories from the RV lifestyle.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-200" />
                <div className="p-6">
                  <span className="text-sm text-primary font-medium">{post.category}</span>
                  <h2 className="font-heading font-bold text-xl text-gray-900 mt-2 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{post.date}</span>
                    <span className="text-primary font-medium hover:text-primary-dark cursor-pointer">
                      Read More →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

**Step 3: Commit**

```bash
mkdir -p app/careers app/blog
git add app/careers/ app/blog/
git commit -m "feat: add Careers and Blog pages"
```

---

## Phase 9: Final Polish

### Task 9.1: Add Placeholder Image

**Files:**
- Create: `public/images/placeholder-rv.jpg`

**Step 1: Create placeholder**

Create a simple SVG placeholder or download a generic RV image to `public/images/placeholder-rv.jpg`.

For now, update `lib/utils.ts` to use a data URI placeholder:

```typescript
// Update getImageUrl in lib/utils.ts:
export function getImageUrl(url: string | null, fallback?: string): string {
  if (!url) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='system-ui' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  }
  return url;
}
```

**Step 2: Commit**

```bash
mkdir -p public/images
git add lib/utils.ts
git commit -m "feat: add placeholder image fallback"
```

---

### Task 9.2: Update Layout with CompareBar

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Ensure CompareBar is in layout**

Final `app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CompareProvider } from "@/context/CompareContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CompareBar } from "@/components/features/CompareBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Terry Town RV | World's Largest Indoor RV Showroom",
  description:
    "Shop the world's largest indoor RV showroom. Browse travel trailers, fifth wheels, motorhomes, and more from top brands.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="font-sans flex flex-col min-h-screen">
        <QueryProvider>
          <FavoritesProvider>
            <CompareProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <CompareBar />
            </CompareProvider>
          </FavoritesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add CompareBar to layout"
```

---

### Task 9.3: Final Build Test

**Step 1: Run build**

```bash
npm run build
```

Expected: Build completes successfully.

**Step 2: Test production build**

```bash
npm run start
```

Open http://localhost:3000 and verify all pages work.

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: complete Terry Town RV website clone"
```

---

## Summary

This implementation plan creates a complete clone of the Terry Town RV website with:

- **Homepage**: Hero, quick search, featured inventory, value props, brand showcase
- **Inventory Listing**: Full filter panel, grid/pagination, URL state management
- **RV Detail Pages**: Image gallery, specifications, contact form, related units
- **Comparison Feature**: Compare up to 4 units side-by-side
- **Favorites Feature**: Save units with local storage persistence
- **Content Pages**: About, Service, Financing, Parts, Contact, Careers, Blog

All powered by the Coast Technology inventory API and built with Next.js 14, TypeScript, and Tailwind CSS.
