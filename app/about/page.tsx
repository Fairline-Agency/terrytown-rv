// app/about/page.tsx

import { Building2, Users, Calendar, Clock, Heart, Award, Wrench } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Terry Town RV",
  description:
    "Learn about Terry Town RV - over 50 years of family-owned excellence. Discover our story, values, and commitment to the RV community.",
};

const stats = [
  { value: "200K+", label: "Sq Ft Showroom", icon: Building2 },
  { value: "50+", label: "Years Experience", icon: Calendar },
  { value: "500+", label: "RVs In Stock", icon: Users },
  { value: "6", label: "Days A Week", icon: Clock },
];

const differentiators = [
  {
    icon: Heart,
    title: "Family Values",
    description:
      "As a family-owned business, we treat every customer like family. Our commitment to honesty, integrity, and exceptional service has been our foundation for over five decades.",
  },
  {
    icon: Award,
    title: "Expert Team",
    description:
      "Our knowledgeable sales staff and certified service technicians bring years of RV experience to help you find and maintain the perfect RV for your lifestyle.",
  },
  {
    icon: Wrench,
    title: "Full Service",
    description:
      "From sales to service, parts to financing, we offer a complete RV experience under one roof. Everything you need for your RV journey is right here.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              About Terry Town RV
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Family-owned and operated since 1973, we&apos;ve grown to become the
              world&apos;s largest indoor RV showroom while never losing sight of what
              matters most: our customers.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="font-heading text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-6">
                Terry Town RV began in 1973 with a simple vision: to create a place where
                families could find the perfect RV to make lasting memories together. What
                started as a small lot with a handful of travel trailers has grown into
                the world&apos;s largest indoor RV showroom, spanning over 200,000 square feet.
              </p>
              <p className="mb-6">
                Through five decades of growth and change in the RV industry, one thing
                has remained constant: our commitment to treating every customer like
                family. We believe that buying an RV should be an exciting experience, not
                a stressful one. That&apos;s why our team takes the time to understand your
                needs, answer your questions, and help you find the RV that&apos;s right for
                your lifestyle and budget.
              </p>
              <p className="mb-6">
                Today, we carry over 500 RVs from the industry&apos;s top manufacturers,
                including travel trailers, fifth wheels, toy haulers, and motorhomes. Our
                climate-controlled showroom allows you to shop in comfort year-round,
                regardless of the weather outside.
              </p>
              <p>
                Beyond sales, our full-service facility includes a state-of-the-art
                service center staffed by certified technicians, a comprehensive parts
                department, and financing options to fit every budget. When you choose
                Terry Town RV, you&apos;re not just buying an RV—you&apos;re joining a community of
                adventurers who share your passion for the open road.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            What Sets Us Apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {differentiators.map((item) => (
              <div key={item.title} className="card p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
