// app/inventory/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  MapPin,
  ChevronRight,
  Ruler,
  Users,
  Layers,
  Check,
} from "lucide-react";
import { fetchUnitById, fetchInventory } from "@/lib/api";
import { formatPrice, calculateSavings, formatNumber, getConditionName } from "@/lib/utils";
import { ImageGallery } from "@/components/detail/ImageGallery";
import { SpecsTable } from "@/components/detail/SpecsTable";
import { ContactForm } from "@/components/detail/ContactForm";
import { DetailActions } from "./DetailActions";
import { RVCard } from "@/components/inventory/RVCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const unit = await fetchUnitById(parseInt(id, 10));

  if (!unit) {
    return {
      title: "Unit Not Found | Terry Town RV",
    };
  }

  const title = `${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name} | Terry Town RV`;
  const description = `Shop the ${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name} ${getConditionName(unit.condition)} ${unit.unit_classification?.name}. ${
    unit.max_sleeping_count ? `Sleeps ${unit.max_sleeping_count}.` : ""
  } ${unit.vehicle_body_length ? `${Math.round(unit.vehicle_body_length)}ft long.` : ""} Starting at ${formatPrice(unit.price_current)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: unit.display_image ? [{ url: unit.display_image }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: unit.display_image ? [unit.display_image] : [],
    },
  };
}

export default async function UnitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const unit = await fetchUnitById(parseInt(id, 10));

  if (!unit) {
    notFound();
  }

  const savings = calculateSavings(unit.price_msrp, unit.price_current);
  const unitTitle = `${unit.year} ${unit.unit_make?.name} ${unit.unit_model?.name}`;

  // Fetch related units (same type)
  const relatedResponse = await fetchInventory({
    type: unit.unit_classification?.name
      ? [unit.unit_classification.name]
      : undefined,
    pageSize: 4,
  });

  // Filter out current unit from related
  const relatedUnits = relatedResponse.data.filter((u) => u.id !== unit.id);

  // Get primary description if available
  const primaryDescription = unit.inventory_unit_descriptions?.find(
    (desc) => desc.heading?.toLowerCase().includes("overview") || desc.heading?.toLowerCase().includes("description")
  ) || unit.inventory_unit_descriptions?.[0];

  // Group options by category
  const optionsByCategory: Record<string, string[]> = {};
  unit.inventory_unit_options?.forEach((option) => {
    const category = option.category || "Standard Features";
    if (!optionsByCategory[category]) {
      optionsByCategory[category] = [];
    }
    optionsByCategory[category].push(option.name);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link
              href="/inventory"
              className="hover:text-primary transition-colors"
            >
              Inventory
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {unitTitle}
            </span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery
              displayImage={unit.display_image}
              images={unit.images || []}
              title={unitTitle}
            />

            {/* Title and Quick Specs (Mobile) */}
            <div className="lg:hidden">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">
                {unitTitle}
              </h1>
              {unit.unit_trim?.name && (
                <p className="text-gray-600 mt-1">{unit.unit_trim.name}</p>
              )}

              {/* Quick Specs */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                {unit.vehicle_body_length && (
                  <span className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    {Math.round(unit.vehicle_body_length)}&apos; Long
                  </span>
                )}
                {unit.max_sleeping_count && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Sleeps {unit.max_sleeping_count}
                  </span>
                )}
                {unit.number_of_slideouts !== null &&
                  unit.number_of_slideouts > 0 && (
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      {unit.number_of_slideouts} Slideout
                      {unit.number_of_slideouts > 1 ? "s" : ""}
                    </span>
                  )}
              </div>
            </div>

            {/* Overview/Description Section */}
            {primaryDescription && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                  {primaryDescription.heading || "Overview"}
                </h2>
                <div
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: primaryDescription.description,
                  }}
                />
              </div>
            )}

            {/* Taglines */}
            {unit.inventory_website_taglines &&
              unit.inventory_website_taglines.length > 0 && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  {unit.inventory_website_taglines.map((tagline) => (
                    <p key={tagline.id} className="text-accent-dark font-medium">
                      {tagline.tagline}
                    </p>
                  ))}
                </div>
              )}

            {/* Specifications Table */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <SpecsTable unit={unit} />
            </div>

            {/* Options List */}
            {Object.keys(optionsByCategory).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                  Features & Options
                </h2>
                <div className="space-y-6">
                  {Object.entries(optionsByCategory).map(
                    ([category, options]) => (
                      <div key={category}>
                        <h3 className="font-semibold text-gray-900 mb-3">
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {options.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Additional Descriptions */}
            {unit.inventory_unit_descriptions &&
              unit.inventory_unit_descriptions.length > 1 && (
                <div className="space-y-6">
                  {unit.inventory_unit_descriptions
                    .filter((desc) => desc.id !== primaryDescription?.id)
                    .map((desc) => (
                      <div
                        key={desc.id}
                        className="bg-white rounded-lg shadow-sm p-6"
                      >
                        <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">
                          {desc.heading}
                        </h2>
                        <div
                          className="prose prose-gray max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: desc.description,
                          }}
                        />
                      </div>
                    ))}
                </div>
              )}
          </div>

          {/* Sidebar (1/3) */}
          <div className="mt-8 lg:mt-0">
            <div className="sticky top-4 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Title (Desktop) */}
                <div className="hidden lg:block mb-4">
                  <h1 className="font-heading text-2xl font-bold text-gray-900">
                    {unitTitle}
                  </h1>
                  {unit.unit_trim?.name && (
                    <p className="text-gray-600 mt-1">{unit.unit_trim.name}</p>
                  )}
                </div>

                {/* Condition & Stock */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    {getConditionName(unit.condition)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock #{unit.stock_number}
                  </span>
                </div>

                {/* Type */}
                {unit.unit_classification?.name && (
                  <p className="text-sm text-gray-600 mb-4">
                    {unit.unit_classification.name}
                  </p>
                )}

                {/* Pricing */}
                <div className="border-t border-b py-4 mb-4">
                  {savings > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>MSRP</span>
                        <span className="line-through">
                          {formatPrice(unit.price_msrp)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600 font-medium mb-2">
                        <span>You Save</span>
                        <span>{formatPrice(savings)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-end">
                    <span className="text-sm text-gray-600">Sale Price</span>
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(unit.price_current)}
                    </span>
                  </div>
                  {unit.price_monthly && (
                    <p className="text-right text-sm text-gray-600 mt-1">
                      Est. {formatPrice(unit.price_monthly)}/month
                    </p>
                  )}
                </div>

                {/* Quick Specs (Desktop) */}
                <div className="hidden lg:flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {unit.vehicle_body_length && (
                    <span className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      {Math.round(unit.vehicle_body_length)}&apos;
                    </span>
                  )}
                  {unit.max_sleeping_count && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Sleeps {unit.max_sleeping_count}
                    </span>
                  )}
                  {unit.number_of_slideouts !== null &&
                    unit.number_of_slideouts > 0 && (
                      <span className="flex items-center gap-1">
                        <Layers className="w-4 h-4" />
                        {unit.number_of_slideouts} Slide
                        {unit.number_of_slideouts > 1 ? "s" : ""}
                      </span>
                    )}
                  {unit.dry_weight && (
                    <span>{formatNumber(unit.dry_weight)} lbs</span>
                  )}
                </div>

                {/* Detail Actions (Save/Compare) */}
                <DetailActions unitId={unit.id} />

                {/* Call Button */}
                <a
                  href={`tel:${unit.company_location?.phone || "1-800-555-0123"}`}
                  className="btn btn-secondary w-full mt-4"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call{" "}
                  {unit.company_location?.phone?.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    "($1) $2-$3"
                  ) || "(800) 555-0123"}
                </a>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ContactForm
                  unitInfo={{
                    year: unit.year,
                    make: unit.unit_make?.name || "",
                    model: unit.unit_model?.name || "",
                    stockNumber: unit.stock_number,
                  }}
                />
              </div>

              {/* Location Info */}
              {unit.company_location && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-heading font-semibold text-lg text-gray-900 mb-3">
                    Location
                  </h3>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {unit.company_location.name}
                      </p>
                      <p>{unit.company_location.address}</p>
                      <p>
                        {unit.company_location.city},{" "}
                        {unit.company_location.state}{" "}
                        {unit.company_location.zip}
                      </p>
                      {unit.company_location.phone && (
                        <a
                          href={`tel:${unit.company_location.phone}`}
                          className="text-primary hover:underline mt-2 block"
                        >
                          {unit.company_location.phone.replace(
                            /(\d{3})(\d{3})(\d{4})/,
                            "($1) $2-$3"
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Units Section */}
        {relatedUnits.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Similar {unit.unit_classification?.name || "RVs"}
              </h2>
              <Link
                href={`/inventory?type=${encodeURIComponent(unit.unit_classification?.name || "")}`}
                className="text-primary hover:text-primary-dark font-medium"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedUnits.slice(0, 4).map((relatedUnit) => (
                <RVCard key={relatedUnit.id} unit={relatedUnit} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
