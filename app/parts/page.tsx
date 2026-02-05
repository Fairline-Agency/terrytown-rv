// app/parts/page.tsx

import Link from "next/link";
import { Package, Truck, HelpCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RV Parts & Accessories | Terry Town RV",
  description:
    "Shop our huge selection of RV parts and accessories. Expert advice and fast ordering. Call our parts department today!",
};

const features = [
  {
    icon: Package,
    title: "Huge Selection",
    description:
      "We stock thousands of parts and accessories for all makes and models. If we don't have it, we can get it fast.",
  },
  {
    icon: Truck,
    title: "Fast Ordering",
    description:
      "Need a part we don't have in stock? Our efficient ordering system means most special orders arrive within days.",
  },
  {
    icon: HelpCircle,
    title: "Expert Advice",
    description:
      "Our knowledgeable parts team can help you find exactly what you need and answer any questions about installation.",
  },
];

export default function PartsPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              RV Parts & Accessories
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              From replacement parts to upgrades and accessories, our parts department
              has everything you need to keep your RV in top shape.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parts Categories Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            What We Carry
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              "Plumbing Supplies",
              "Electrical Components",
              "Heating & Cooling",
              "Appliances",
              "Awnings & Covers",
              "Hitches & Towing",
              "Leveling Systems",
              "Interior Accessories",
              "Exterior Accessories",
              "Lighting",
              "Sealants & Adhesives",
              "Cleaning Supplies",
            ].map((category) => (
              <div
                key={category}
                className="bg-white p-4 rounded-lg shadow-sm text-center font-medium text-gray-700"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Need a Part?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Call our parts department and let our experts help you find exactly what you
            need. We&apos;re happy to check stock, answer questions, and place special orders.
          </p>
          <Link
            href="tel:+15551234569"
            className="btn bg-white text-accent hover:bg-gray-100 text-lg px-8 py-3"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Parts: (555) 123-4569
          </Link>
        </div>
      </section>
    </>
  );
}
