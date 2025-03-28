import React from "react";
import { Button } from "@/components/ui/button";
import VenueCard from "../ui/VenueCard";
import AnimatedSection from "@/components/ui/AnimatedSection";

// Sample venue data
const venues = [
  {
    id: 1,
    name: "Crystal Ballroom",
    image:
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2148&q=80",
    location: "Downtown, New York",
    price: "$2,500",
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 2,
    name: "Sunset Beach Resort",
    image:
      "https://images.unsplash.com/photo-1439130490301-25e322d88054?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80",
    location: "Miami Beach, Florida",
    price: "$4,200",
    rating: 4.9,
    reviewCount: 89,
  },
  {
    id: 3,
    name: "Alpine Lodge",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Aspen, Colorado",
    price: "$3,750",
    rating: 4.7,
    reviewCount: 65,
  },
  {
    id: 4,
    name: "Urban Loft Space",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    location: "Chicago, Illinois",
    price: "$1,900",
    rating: 4.6,
    reviewCount: 42,
  },
];

const FeaturedVenues: React.FC = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-white pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <AnimatedSection animation="fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              Featured Venues
            </span>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={100}>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Discover exceptional spaces for your events
            </h2>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={200}>
            <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
              From elegant ballrooms to unique outdoor spaces, find the perfect
              venue that matches your vision and budget.
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {venues.map((venue, index) => (
            <AnimatedSection
              key={venue.id}
              animation="scale-in"
              delay={300 + index * 100}
              threshold={0.1}
            >
              <VenueCard
                name={venue.name}
                image={venue.image}
                location={venue.location}
                price={venue.price}
                rating={venue.rating}
                reviewCount={venue.reviewCount}
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
            Explore All Venues
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedVenues;
