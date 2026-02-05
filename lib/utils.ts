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

export function getImageUrl(url: string | null, fallback?: string): string {
  if (!url) {
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext fill='%239ca3af' font-family='system-ui' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
  }
  return url;
}
