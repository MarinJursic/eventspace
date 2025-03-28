"use client";
import React, { useEffect } from "react";
import Hero from "@/components/home/Hero";
import FeaturedVenues from "@/components/home/FeaturedVenues";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";

const Page: React.FC = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero />
        <FeaturedVenues />
        <FeaturedServices />
        <HowItWorks />
      </main>
    </div>
  );
};

export default Page;
