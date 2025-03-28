"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import SearchBar from "../ui/SearchBar";
import AnimatedSection from "../ui/AnimatedSection";
import { Building, ShoppingBag } from "lucide-react";

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);

    const handleParallax = () => {
      if (!heroRef.current) return;
      const scrollPosition = window.scrollY;
      const parallaxOffset = scrollPosition * 0.2;
      heroRef.current.style.transform = `translateY(${parallaxOffset}px)`;
    };

    window.addEventListener("scroll", handleParallax);
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      <div
        ref={heroRef}
        className="absolute inset-0 z-0 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,rgba(200,200,250,0.1)_50%)]" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: 0.15,
          }}
        />
      </div>

      <div
        className={`container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pb-32 relative z-10 transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <AnimatedSection animation="fade-in">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-primary text-sm font-medium mb-4">
              Plan your event from start to finish
            </span>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={100}>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight mb-6">
              Make your next event{" "}
              <span className="text-gradient">unforgettable</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground mx-auto max-w-2xl mb-8">
              Discover and book amazing venues and services for your event, or
              bring your own venue and only book the services you need.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={300}>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button size="lg" className="rounded-xl" asChild>
                <Link href="/venues">
                  <span className="flex items-center">
                    <Building className="mr-2 h-5 w-5" /> Find a Venue
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl"
                asChild
              >
                <Link href="/services">
                  <span className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" /> Browse Services
                  </span>
                </Link>
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="slide-up" delay={400}>
            <SearchBar className="mx-auto" />
          </AnimatedSection>
        </div>

        <div className="max-w-md md:max-w-xl lg:max-w-3xl mx-auto mt-16 text-center">
          <AnimatedSection animation="fade-in" delay={600}>
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by event planners around the world
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fade-in" delay={700}>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <img
                src="https://sm-img.imgix.net/cms/eventim_e5a9c39a35.png"
                alt="Partner 1"
                className="h-9 md:h-12"
              />
              <img
                src="https://download.logo.wine/logo/WeWork/WeWork-Logo.wine.png"
                alt="Partner 2"
                className="h-9 md:h-12"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png"
                alt="Partner 3"
                className="h-6 md:h-8"
              />
              <img
                src="https://i0.wp.com/www.kruzovi.com/wp-content/uploads/2018/08/bookingcom-logo.png?fit=512%2C512"
                alt="Partner 4"
                className="h-16 md:h-24"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default Hero;
