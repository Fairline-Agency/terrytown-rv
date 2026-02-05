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
