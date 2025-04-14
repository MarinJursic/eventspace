import React, { useMemo } from "react"; // Import useMemo
import Link from "next/link"; // Import Link
import { Button } from "@/components/ui/button";
import ServiceCard from "../ui/ServiceCard"; // Assuming path is correct
import AnimatedSection from "@/components/ui/AnimatedSection";
import { mockServices, MockService } from "@/lib/mockServices"; // Import shared mock data and type

// Helper to format price (same as used in Services page - consider moving to utils)
const formatPrice = (service: MockService): string => {
    const base = `$${service.price.basePrice.toLocaleString()}`;
    switch(service.price.model) {
        case 'hour': return `${base} / hour`;
        case 'day': return `${base} / event day`; // Or just base if 'day' means total package
        case 'week': return `${base} / week`;
        default: return `From ${base}`;
    }
};

const FeaturedServices: React.FC = () => {

  // Select featured services (e.g., sponsored first, then maybe top-rated)
  const featuredServices = useMemo(() => {
    return mockServices
      .filter(service => service.status === 'active') // Only show active services
      .sort((a, b) => {
          // Prioritize sponsored services
          if (a.sponsored.isActive && !b.sponsored.isActive) return -1;
          if (!a.sponsored.isActive && b.sponsored.isActive) return 1;
          // If sponsorship is the same, sort by rating descending
          return b.rating.average - a.rating.average;
      })
      .slice(0, 4); // Take the top 4 for the featured section
  }, []); // Runs only once as mockServices is static

  return (
    <section className="py-20 bg-gradient-to-b from-white via-secondary/10 to-white relative overflow-hidden"> {/* Adjusted gradient */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16"> {/* Increased bottom margin */}
          <AnimatedSection animation="fade-in">
            {/* Consider a different style if needed */}
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Featured Services
            </span>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={100}>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4"> {/* Reduced mb */}
              Enhance Your Event Experience
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={200}>
            <p className="text-base md:text-lg text-muted-foreground mx-auto max-w-2xl">
              Discover top-rated professionals for catering, photography, entertainment, and more to make your occasion unforgettable.
            </p>
          </AnimatedSection>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Adjusted gap */}
          {featuredServices.map((service, index) => (
            <AnimatedSection
              key={service.id}
              animation="scale-in"
              delay={300 + index * 100}
              threshold={0.1}
              className="h-full" // Ensure animation container takes full height for card
            >
              <ServiceCard
                // Pass props matching the ServiceCard interface
                id={service.id} // Pass the string ID
                name={service.name}
                image={service.images[0]?.url || "https://via.placeholder.com/300x200?text=No+Image"} // Use first image or fallback
                category={service.type || "Service"} // Use type field
                price={formatPrice(service)} // Use the formatter
                rating={service.rating.average}
                reviewCount={service.rating.count}
                // className="h-full" // Add h-full to ServiceCard itself via its className prop if needed
              >
                {/* Optionally add a badge if it's sponsored */}
                {service.sponsored.isActive && (
                   <span className="absolute top-3 right-3 z-10 inline-block bg-gradient-to-tr from-yellow-400 to-amber-500 text-white px-2 py-0.5 text-xs font-semibold rounded-full border border-white/50">
                     Sponsored
                   </span>
                )}
              </ServiceCard>
            </AnimatedSection>
          ))}
        </div>

        {/* Browse All Button */}
        <AnimatedSection
          animation="fade-in"
          delay={featuredServices.length > 0 ? 300 + featuredServices.length * 100 : 400} // Delay based on cards
          className="mt-12 text-center"
        >
          <Button size="lg" variant="outline" className="rounded-xl">
             {/* Link the button to the main services page */}
            <Link href="/services">
                Browse All Services
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedServices;