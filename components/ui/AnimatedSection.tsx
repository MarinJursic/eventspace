"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?:
    | "fade-in"
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right"
    | "scale-in";
  threshold?: number;
  once?: boolean;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  delay = 0,
  animation = "fade-in",
  threshold = 0.1,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }, delay);
        } else if (!entry.isIntersecting && !once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay, once, threshold, hasAnimated]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        {
          "opacity-0 translate-y-8": animation === "fade-in" && !isVisible,
          "opacity-0 translate-y-16":
            (animation === "slide-up" || animation === "fade-up") && !isVisible,
          "opacity-0 -translate-y-16":
            (animation === "slide-down" || animation === "fade-down") &&
            !isVisible,
          "opacity-0 translate-x-16":
            (animation === "slide-right" || animation === "fade-right") &&
            !isVisible,
          "opacity-0 -translate-x-16":
            (animation === "slide-left" || animation === "fade-left") &&
            !isVisible,
          "opacity-0 scale-95": animation === "scale-in" && !isVisible,
          "opacity-100 translate-y-0 translate-x-0 scale-100": isVisible,
        },
        className
      )}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
