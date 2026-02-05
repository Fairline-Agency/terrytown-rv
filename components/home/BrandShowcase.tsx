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
