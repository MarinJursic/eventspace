import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ServiceCardProps {
  id?: number;
  name: string;
  image: string;
  category: string;
  price: string;
  rating: number;
  reviewCount: number;
  className?: string;
  children?: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id = 1, // Default ID if not provided
  name,
  image,
  category,
  price,
  rating,
  reviewCount,
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-block bg-white/90 backdrop-blur-xs text-xs font-medium px-2.5 py-1 rounded-full">
          {category}
        </span>
      </div>

      {children}

      <div className="aspect-square w-full overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-grow p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-display font-semibold text-lg leading-tight">
            {name}
          </h3>
          <div className="flex items-center bg-secondary px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center text-sm">
          <span className="font-semibold">{price}</span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {reviewCount} reviews
        </p>

        <div className="mt-auto pt-4">
          <Button
            variant="outline"
            className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all"
            asChild
          >
            <Link href={`/services/${id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
