// components/home/FeaturedServices.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ServiceCard from "../ui/ServiceCard"; // Assuming path is correct
import AnimatedSection from "@/components/ui/AnimatedSection";
import { SerializedService } from "../service/details/ServiceDetailClient";
import { Badge } from "@/components/ui/badge"; // Import Badge

// Helper function to format price (can be moved to utils)
const formatPrice = (service: SerializedService): string => {
  if (!service?.price) return "N/A"; // Add safety check
  const base = `$${service.price.basePrice.toLocaleString()}`;
  switch (service.price.model) {
    case "hour":
      return `${base} / hour`;
    case "day":
      return `${base} / event day`;
    case "week":
      return `${base} / week`;
    default:
      return `From ${base}`;
  }
};

// Define props for the component to accept fetched data
interface FeaturedServicesProps {
  services: SerializedService[]; // Expect services as a prop
}

// Make it a regular functional component accepting props
const FeaturedServices: React.FC<FeaturedServicesProps> = ({ services }) => {
  // No data fetching or useMemo needed here - uses the 'services' prop

  return (
    <section className="py-20 bg-gradient-to-b from-white via-secondary/10 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <AnimatedSection animation="fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Featured Services
            </span>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={100}>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Enhance Your Event Experience
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={200}>
            <p className="text-base md:text-lg text-muted-foreground mx-auto max-w-2xl">
              Discover top-rated professionals for catering, photography,
              entertainment, and more.
            </p>
          </AnimatedSection>
        </div>

        {/* Service Cards Grid - Map over the 'services' prop */}
        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {services.map((service, index) => (
              <AnimatedSection
                key={service.id || service._id} // Use fetched ID
                animation="scale-in"
                delay={300 + index * 50}
                threshold={0.1}
                className="h-full"
              >
                <ServiceCard
                  id={service.id || service._id} // Pass ID
                  name={service.name}
                  image={
                    service.images?.[0]?.url ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  category={service.type || "Service"} // Use type field
                  price={formatPrice(service)} // Use formatter
                  rating={service.rating.average}
                  reviewCount={service.rating.count}
                  // className="h-full" // Add to ServiceCard if needed
                >
                  {/* Sponsored Badge */}
                  {service.sponsored?.isActive && (
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-none px-2 py-0.5 text-xs"
                    >
                      Sponsored
                    </Badge>
                  )}
                </ServiceCard>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection animation="fade-in" delay={300}>
            <p className="text-center text-muted-foreground py-8">
              No featured services available at the moment.
            </p>
          </AnimatedSection>
        )}

        {/* Browse All Button */}
        <AnimatedSection
          animation="fade-in"
          delay={services.length > 0 ? 300 + services.length * 50 : 400}
          className="mt-12 text-center"
        >
          <Button size="lg" variant="outline" className="rounded-xl" asChild>
            <Link href="/services">Browse All Services</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedServices;
