// app/careers/page.tsx

import Link from "next/link";
import { Heart, TrendingUp, Gift, MapPin, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | Terry Town RV",
  description:
    "Join the Terry Town RV team! Explore career opportunities in sales, service, parts, and more. Family culture, growth opportunities, and great benefits.",
};

const benefits = [
  {
    icon: Heart,
    title: "Family Culture",
    description:
      "We're not just coworkers - we're family. Enjoy a supportive, welcoming environment where everyone's contributions are valued.",
  },
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    description:
      "We invest in our team members' development with training programs, certifications, and clear paths for advancement.",
  },
  {
    icon: Gift,
    title: "Great Benefits",
    description:
      "Competitive pay, health insurance, 401(k), paid time off, employee discounts, and more to support you and your family.",
  },
];

const openings = [
  {
    title: "Sales Consultant",
    department: "Sales",
    type: "Full-time",
    description:
      "Help customers find their perfect RV! We're looking for enthusiastic individuals who love working with people and have a passion for the RV lifestyle.",
  },
  {
    title: "Service Technician",
    department: "Service",
    type: "Full-time",
    description:
      "Join our expert service team. We're seeking experienced RV technicians with strong diagnostic skills and attention to detail.",
  },
  {
    title: "Parts Counter",
    department: "Parts",
    type: "Full-time",
    description:
      "Help customers find the parts and accessories they need. Product knowledge and customer service skills are a must.",
  },
  {
    title: "Detailer",
    department: "Service",
    type: "Full-time",
    description:
      "Keep our RV inventory looking its best. We're looking for detail-oriented individuals who take pride in their work.",
  },
];

export default function CareersPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Join Our Team
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Build your career with Michigan&apos;s largest RV dealer. We&apos;re always looking
              for talented, passionate people to join the Terry Town family.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Why Work Here */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Why Work at Terry Town RV?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Current Openings
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Explore our open positions below. Don&apos;t see a perfect fit? We&apos;re always
            accepting applications from talented individuals.
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            {openings.map((job) => (
              <div
                key={job.title}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-heading text-xl font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {job.department}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        {job.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 md:mb-0">{job.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      Grand Rapids, MI
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      href={`/contact?subject=careers&position=${encodeURIComponent(job.title)}`}
                      className="btn btn-primary"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Application CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Don&apos;t See the Right Position?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented people to join our team. Submit a general
            application and we&apos;ll keep you in mind for future opportunities.
          </p>
          <Link
            href="/contact?subject=careers"
            className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
          >
            Submit General Application
          </Link>
        </div>
      </section>
    </>
  );
}
