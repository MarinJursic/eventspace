import React from "react";
import { Button } from "@/components/ui/button";
import VenueCard from "../ui/VenueCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {venues} from "@/lib/mockVenues"
import Link from "next/link";

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
                venue={venue}
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
             {/* Link the button to the main venues page */}
             <Link href="/venues">
                Browse All Venues
            </Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedVenues;
