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
