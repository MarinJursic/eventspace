import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Venue } from "@/lib/mockVenues";

interface VenueCardProps {
  venue: Venue;
  className?: string;
}

const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  className
}) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl transition-all duration-300 bg-white hover:shadow-xl",
        className
      )}
    >
      <div className="aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
        <img
          src={venue.images[0].url || "/placeholder.jpg"}
          alt={venue.images[0].alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
      </div>

      <div className="flex flex-col flex-grow p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-display font-semibold text-lg leading-tight">
            {venue.name}
          </h3>
          <div className="flex items-center bg-secondary px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
            <span className="text-xs font-medium">{venue.rating.average}</span>
          </div>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{venue.location.city}</p>

        <div className="mt-3 flex items-center text-sm">
          <span className="font-semibold">${venue.price.basePrice}</span>
          <span className="ml-1 text-muted-foreground">/day</span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          {venue.reviews.length} reviews
        </p>

        <div className="mt-auto pt-4">
          <Button
            variant="outline"
            className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all"
            asChild
          >
            <Link href={`/venues/${venue.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;
