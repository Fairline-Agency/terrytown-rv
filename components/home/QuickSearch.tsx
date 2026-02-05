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
