// components/home/ValueProps.tsx

import { Building2, Shield, DollarSign, Wrench } from "lucide-react";

const props = [
  {
    icon: Building2,
    title: "Largest Indoor Showroom",
    description:
      "Shop year-round in our climate-controlled facility with hundreds of RVs on display.",
  },
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description:
      "Every RV undergoes a thorough inspection before it hits our showroom floor.",
  },
  {
    icon: DollarSign,
    title: "Best Price Promise",
    description:
      "Competitive pricing and flexible financing options to fit your budget.",
  },
  {
    icon: Wrench,
    title: "Expert Service",
    description:
      "Full-service department with certified technicians for all your RV needs.",
  },
];

export function ValueProps() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl font-bold text-gray-900 text-center mb-12">
          Why Choose Terry Town RV
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map((prop) => (
            <div key={prop.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <prop.icon className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">
                {prop.title}
              </h3>
              <p className="text-gray-600">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
