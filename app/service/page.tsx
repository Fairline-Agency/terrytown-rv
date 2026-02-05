// app/service/page.tsx

import Link from "next/link";
import {
  Award,
  Settings,
  Clock,
  Thermometer,
  Droplets,
  Zap,
  Home,
  ArrowLeftRight,
  Snowflake,
  Sun,
  Microwave,
  Tent,
  Disc,
  CircleDot,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RV Service Center | Terry Town RV",
  description:
    "Expert RV service and repair from certified technicians. Routine maintenance, AC/heating, plumbing, electrical, and more. Schedule your service today.",
};

const features = [
  {
    icon: Award,
    title: "Certified Technicians",
    description:
      "Our factory-trained and certified technicians have the expertise to handle any RV repair or maintenance need.",
  },
  {
    icon: Settings,
    title: "Quality Parts",
    description:
      "We use only genuine OEM and high-quality aftermarket parts to ensure your RV performs at its best.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description:
      "We understand you want to get back on the road. Our efficient service process minimizes your wait time.",
  },
];

const services = [
  { icon: Settings, name: "Routine Maintenance" },
  { icon: Thermometer, name: "AC/Heating" },
  { icon: Droplets, name: "Plumbing" },
  { icon: Zap, name: "Electrical" },
  { icon: Home, name: "Roof Repair" },
  { icon: ArrowLeftRight, name: "Slide-Out Service" },
  { icon: Snowflake, name: "Winterization" },
  { icon: Sun, name: "De-Winterization" },
  { icon: Microwave, name: "Appliance Repair" },
  { icon: Tent, name: "Awning Service" },
  { icon: Disc, name: "Brake Service" },
  { icon: CircleDot, name: "Wheel Bearing" },
];

export default function ServicePage() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary-dark to-primary text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              RV Service Center
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Keep your RV running smoothly with our expert service team. From routine
              maintenance to major repairs, we have you covered.
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

      {/* Services List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                  <service.icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Schedule Your Service Today
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Call our service department to schedule an appointment or discuss your RV
            repair needs with one of our experts.
          </p>
          <Link
            href="tel:+15551234568"
            className="btn bg-white text-secondary hover:bg-gray-100 text-lg px-8 py-3"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Service: (555) 123-4568
          </Link>
        </div>
      </section>
    </>
  );
}
