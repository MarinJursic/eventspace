import React from "react";
import { Button } from "@/components/ui/button";
import ServiceCard from "../ui/ServiceCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Sample service data
const services = [
  {
    id: 1,
    name: "Elegant Catering Co.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Catering",
    price: "From $35 per guest",
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: 2,
    name: "Moments Photography",
    image:
      "https://images.unsplash.com/photo-1567947121469-241e6493f5ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=2070&q=80",
    category: "Photography",
    price: "From $1,200",
    rating: 4.8,
    reviewCount: 64,
  },
  {
    id: 3,
    name: "Harmonic DJs",
    image:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "Entertainment",
    price: "From $800",
    rating: 4.7,
    reviewCount: 52,
  },
  {
    id: 4,
    name: "Bloom & Petal Florists",
    image:
      "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=2250&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Decoration",
    price: "From $500",
    rating: 4.6,
    reviewCount: 39,
  },
];

const FeaturedServices: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-secondary/20 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedSection animation="fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              Premium Services
            </span>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={100}>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Complete your event with quality services
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={200}>
            <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
              From catering to photography, find trusted professionals to make
              your event truly memorable.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <AnimatedSection
              key={service.id}
              animation="scale-in"
              delay={300 + index * 100}
              threshold={0.1}
            >
              <ServiceCard
                name={service.name}
                image={service.image}
                category={service.category}
                price={service.price}
                rating={service.rating}
                reviewCount={service.reviewCount}
              />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection
          animation="fade-in"
          delay={700}
          className="mt-12 text-center"
        >
          <Button size="lg" variant="outline" className="rounded-xl">
            Browse All Services
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedServices;
