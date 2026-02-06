// components/home/HeroBanner.tsx

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] text-white overflow-hidden">
      {/* Background Image */}
      <Image
        src="/company/branding/hero-showroom.png"
        alt="Terry Town RV Showroom"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/70 to-transparent" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-16 md:py-24 flex items-center min-h-[500px] md:min-h-[600px]">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            The World&apos;s Largest Indoor RV Showroom
          </h1>
          <p className="text-lg md:text-xl text-gray-100 mb-8 drop-shadow">
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
