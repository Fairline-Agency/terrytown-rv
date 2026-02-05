// components/home/HeroBanner.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-r from-primary-dark to-primary text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            The World&apos;s Largest Indoor RV Showroom
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
