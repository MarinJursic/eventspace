import React from "react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Search, MapPin, Calendar, CheckCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: Search,
    title: "Search",
    description:
      "Browse our curated collection of venues and services based on your preferences and needs.",
  },
  {
    id: 2,
    icon: MapPin,
    title: "Compare",
    description:
      "View detailed information, photos, pricing, and reviews to find your perfect match.",
  },
  {
    id: 3,
    icon: Calendar,
    title: "Book",
    description:
      "Reserve your venue and services with our secure booking system in just a few clicks.",
  },
  {
    id: 4,
    icon: CheckCircle,
    title: "Enjoy",
    description:
      "Relax and enjoy your perfectly planned event with all details taken care of.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&&w=2070&q=80')] bg-cover bg-center opacity-[0.02]"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full h-full max-w-5xl bg-gradient-to-r from-transparent to-primary/5 rounded-l-[100px] transform  opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedSection animation="fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              Simple Process
            </span>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={100}>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
              How it works
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={200}>
            <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
              Finding and booking the perfect venue and services has never been
              easier. Just follow these simple steps.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <AnimatedSection
              key={step.id}
              animation="fade-in"
              delay={300 + index * 100}
              className="relative"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/5 rounded-full transform scale-150 animate-pulse-slow" />
                  <div className="relative bg-white rounded-full p-5 shadow-neo-sm z-10">
                    <step.icon size={32} className="text-primary" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 left-full h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-primary/20 to-transparent" />
                  )}
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
