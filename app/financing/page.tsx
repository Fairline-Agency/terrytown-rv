// app/financing/page.tsx

import Link from "next/link";
import {
  Check,
  FileText,
  ThumbsUp,
  Car,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RV Financing | Terry Town RV",
  description:
    "Flexible RV financing options with competitive rates. Quick approval process for all credit types. Get pre-approved today!",
};

const benefits = [
  "Competitive interest rates",
  "Flexible loan terms up to 20 years",
  "Quick approval process",
  "No prepayment penalties",
  "Financing for all credit types",
  "Trade-in options available",
];

const steps = [
  {
    icon: FileText,
    step: "1",
    title: "Apply",
    description:
      "Fill out our simple online application or visit us in person. We'll gather the information needed to find the best financing options for you.",
  },
  {
    icon: ThumbsUp,
    step: "2",
    title: "Get Approved",
    description:
      "Our finance team works with multiple lenders to find you the best rates and terms. Most applications are approved within 24 hours.",
  },
  {
    icon: Car,
    step: "3",
    title: "Drive Away",
    description:
      "Once approved, complete your paperwork and drive away in your new RV! It's that simple to start your next adventure.",
  },
];

export default function FinancingPage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              RV Financing Made Easy
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Don&apos;t let financing stand between you and your dream RV. We offer
              flexible options to fit every budget and credit situation.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Financing Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-gray-900">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Simple 3-Step Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.title} className="relative text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent text-white mb-6">
                  <span className="font-heading text-3xl font-bold">{item.step}</span>
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

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Contact our finance team today to discuss your options and get pre-approved.
            We&apos;re here to help you hit the road in your dream RV.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="tel:+15551234567"
              className="btn bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: (555) 123-4567
            </Link>
            <Link
              href="/contact?subject=financing"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-3"
            >
              Contact Finance Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
