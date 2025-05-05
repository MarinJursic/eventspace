import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VenueCard from "../ui/VenueCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { SerializedVenueListItem } from "../../types/venue.types";

// Define props for the component
interface FeaturedVenuesProps {
  venues: SerializedVenueListItem[]; // Expect venues as a prop
}

// Make it a regular functional component, not async
const FeaturedVenues: React.FC<FeaturedVenuesProps> = ({ venues }) => {
  // No data fetching here - uses the 'venues' prop

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-white pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          {/* ... Animated Sections for header ... */}
          <AnimatedSection animation="fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              Featured Venues
            </span>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={100}>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Discover Exceptional Spaces
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={200}>
            <p className="text-base md:text-lg text-muted-foreground mx-auto max-w-2xl">
              Explore some of our top-rated and most popular venues perfect for
              any occasion.
            </p>
          </AnimatedSection>
        </div>

        {/* Venues Grid - Map over the 'venues' prop */}
        {venues && venues.length > 0 ? ( // Check if prop exists and has items
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {venues.map((venue, index) => (
              <AnimatedSection
                key={venue.id || venue._id}
                animation="scale-in"
                delay={300 + index * 50}
                threshold={0.1}
                className="h-full"
              >
                <VenueCard venue={venue} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection animation="fade-in" delay={300}>
            <p className="text-center text-muted-foreground py-8">
              No featured venues available at the moment.
            </p>
          </AnimatedSection>
        )}

        {/* Browse All Button */}
        <AnimatedSection
          animation="fade-in"
          delay={venues.length > 0 ? 300 + venues.length * 50 : 400}
          className="mt-12 text-center"
        >
          <Button size="lg" variant="outline" className="rounded-xl" asChild>
            <Link href="/venues">Browse All Venues</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedVenues;
